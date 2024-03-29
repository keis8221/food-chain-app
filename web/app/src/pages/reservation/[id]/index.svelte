<script lang="ts">
  import { goto } from "@roxi/routify";
  import { addToast } from "../../../stores/Toast";
  import {
    ReservationRepository,
    type TReservation,
    RESERVATION_STATUS,
  } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import Button from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import List, { Item, Graphic, Text } from "@smui/list";
  import Radio from "@smui/radio";
  import StatusLabel from ".././_components/StatusLabel.svelte";
  import { markAsLogoutState } from "../../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../../constants/product";
  import { profile } from "../../../stores/Account";
  import { AccountService } from "../../../services/AccountService";
  import Paper from "@smui/paper";

  $: reservationRepository = new ReservationRepository();

  let reservationStatus: TReservation["status"];

  async function fetchReservationProducts() {
    try {
      const reservationData = await reservationRepository.findOne($params.id);
      reservationStatus = reservationData.status;
      return reservationData;
    } catch (err) {
      handleError(err);
      return null;
    }
  }

  $: isShowPackedButton = (reservation) => {
    return (
      RESERVATION_STATUS.packking === reservationStatus &&
      reservation.product.producerId === $profile.id
    );
  };

  $: isShowKeptButton = (reservation) => {
    return (
      RESERVATION_STATUS.shipping === reservationStatus &&
      reservation.receiveLocationId === $profile.id
    );
  };

  $: isShowReceivedButton = (reservation) => {
    return (
      RESERVATION_STATUS.keeping === reservationStatus &&
      reservation.consumerId === $profile.id
    );
  };

  let isOpenPackedConfirmDialog = false;
  let isOpenKeptConfirmDialog = false;
  let isOpenReceivedConfirmDialog = false;

  let selectedShipperId = "";

  async function fetchLogistics() {
    try {
      const logistics = await new AccountService().getLogistics();
      logistics.push($profile);
      return Object.fromEntries(logistics.map(({ id, name }) => [id, name]));
    } catch (err) {
      handleError(err);
      return [];
    }
  }

  async function onDialogClosedHandle(e: CustomEvent<{ action: string }>) {
    switch (e.detail.action) {
      case "packed":
        await packed();
        break;
      case "kept":
        await kept();
        break;
      case "received":
        await received();
        break;
      default:
        // NOP
        break;
    }
  }

  async function packed() {
    try {
      const updateReservationData = await reservationRepository.packed(
        $params.id,
        { shipperId: selectedShipperId }
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約作物の出荷が完了しました。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  async function kept() {
    try {
      const updateReservationData = await reservationRepository.kept(
        $params.id
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約作物を店舗で保管しています。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  async function received() {
    try {
      const updateReservationData = await reservationRepository.received(
        $params.id
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約作物を受取りました。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    switch (err.error || err.message) {
      case "Bad Request":
        addToast({
          message: "予約の更新に失敗しました。開発者へお問い合わせください。",
          type: "error",
        });
        break;
      case "Unauthorized":
        markAsLogoutState();
        addToast({
          message: "認証が切れました。再度ログインしてください。",
          type: "error",
        });
        $goto("/login");
        break;
      default:
        addToast({
          message:
            "予約の更新に失敗しました。もう一度時間をおいて再読み込みしてください。",
          type: "error",
        });
        break;
    }
  }
</script>

{#await fetchReservationProducts()}
  <div class="flex justify-center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then reservationData}
  <div class="grid justify-center">
    <div class="container">
      <div class="text-lg">
        <p class="inline-block align-middle">
          {#if reservationData.product.producer.image}
            <img
              class="w-[40px] h-[40px] rounded-[50%]"
              src={reservationData.product.producer.image}
              alt=""
            />
          {:else if reservationData.product.producer.classification === "individual"}
            <img
              class="w-[40px] h-[40px] rounded-[50%]"
              src="./../../../public/images/farmer.png"
              alt=""
            />
          {:else if reservationData.product.producer.classification === "corporate"}
            <img
              class="w-[40px] h-[40px] rounded-[50%]"
              src="./../../../public/images/house.png"
              alt=""
            />
          {/if}
        </p>
        <p class="inline-block align-middle">
          {reservationData.product.producer.name}
        </p>
      </div>
      <div class="relative mb-5 mt-5 flex w-[280px] justify-between font-bold">
        <p
          class="flex w-[260px] flex-row flex-wrap items-end text-left text-xl"
        >
          {reservationData.product.name}
        </p>
        <p class="align-middle text-right">
          <StatusLabel bind:status={reservationStatus} />
        </p>
      </div>
    </div>

    <div>
      <div class="flex justify-center items-center mb-2">
        <div class="relative w-[300px] h-[300px] object-contain">
          <img
            class="absolute top-0 bottom-0 left-0 right-0 h-auto w-auto max-h-full max-w-full m-auto"
            src={reservationData.product.image ??
              "./../../../public/images/default_product_image.png"}
            alt=""
          />
        </div>
      </div>

      <div class="m-auto table font-bold">
        <div class="flex">
          <div class="flex h-auto flex-col text-left">
            <p>数量</p>
            <p>合計金額</p>
          </div>
          <div>
            <p>：</p>
            <p>：</p>
          </div>
          <div class="ml-5">
            <p>
              {reservationData.quantity}{CROP_UNITS_LABEL[
                reservationData.product.unit
              ]}
            </p>
            <p>
              {reservationData.product.unitPrice * reservationData.quantity}円
            </p>
          </div>
        </div>
      </div>
      <Paper class="m-auto mt-5 table" color="secondary" variant="outlined">
        <div class="flex">
          <div class="flex h-auto flex-col text-left">
            <p>予約者</p>
            <p>希望日</p>
            <p>場所</p>
          </div>
          <div>
            <p>：</p>
            <p>：</p>
            <p>：</p>
          </div>
          <div class="ml-5">
            <p>
              {reservationData.consumer.name}
            </p>
            <p>
              {dayjs(reservationData.desiredAt).format("YYYY/MM/DD")}
            </p>
            <p class="flex w-[200px] flex-row flex-wrap">
              {reservationData.receiveLocation.name}
              <br />
              {reservationData.receiveLocation.address}
            </p>
          </div>
        </div>
      </Paper>
    </div>
    <div class="grid justify-center p-3 mt-3">
      {#if isShowPackedButton(reservationData)}
        <Button
          class="w-[150px]  px-4 py-2 rounded-full"
          color="secondary"
          variant="raised"
          on:click={() => (isOpenPackedConfirmDialog = true)}
        >
          <p class="text-lg font-bold">出荷</p>
        </Button>
        <Dialog
          selection
          bind:open={isOpenPackedConfirmDialog}
          on:SMUIDialog:closed={onDialogClosedHandle}
        >
          <Title>配送者を選択して出荷しますか？</Title>
          <Content>
            {#await fetchLogistics()}
              <div style="display: flex; justify-content: center">
                <CircularProgress
                  style="height: 160px; width: 32px;"
                  indeterminate
                />
              </div>
            {:then logistics}
              <div class="max-h-[300px]">
                <List radioList>
                  {#each Object.keys(logistics) as shipper}
                    <Item>
                      <Graphic>
                        <Radio bind:group={selectedShipperId} value={shipper} />
                      </Graphic>
                      <Text>{logistics[shipper]}</Text>
                    </Item>
                  {/each}
                </List>
              </div>
            {/await}
          </Content>
          <Actions>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="outlined"
            >
              <p class="font-bold text-lg">キャンセル</p>
            </Button>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="raised"
              action="packed"
              disabled={!selectedShipperId}
            >
              <p class="font-bold text-lg">出荷</p>
            </Button>
          </Actions>
        </Dialog>
      {/if}
      {#if isShowKeptButton(reservationData)}
        <Button
          class="w-[150px]  px-4 py-2 rounded-full"
          color="secondary"
          variant="raised"
          on:click={() => (isOpenKeptConfirmDialog = true)}
        >
          <p class="text-lg font-bold">店舗預かり</p>
        </Button>
        <Dialog
          selection
          bind:open={isOpenKeptConfirmDialog}
          on:SMUIDialog:closed={onDialogClosedHandle}
        >
          <Title>店舗で作物を預かりましたか？</Title>
          <Actions>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="outlined"
            >
              <p class="font-bold text-lg">キャンセル</p>
            </Button>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="raised"
              action="kept"
            >
              <p class="font-bold text-lg">店舗預かり</p>
            </Button>
          </Actions>
        </Dialog>
      {/if}
      {#if isShowReceivedButton(reservationData)}
        <Button
          class="w-[150px]  px-4 py-2 rounded-full"
          color="secondary"
          variant="raised"
          on:click={() => (isOpenReceivedConfirmDialog = true)}
        >
          <p class="text-lg font-bold">受取り</p>
        </Button>
        <Dialog
          selection
          bind:open={isOpenReceivedConfirmDialog}
          on:SMUIDialog:closed={onDialogClosedHandle}
        >
          <Title>作物を受取りましたか？</Title>
          <Actions>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="outlined"
            >
              <p class="font-bold text-lg">キャンセル</p>
            </Button>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="raised"
              action="received"
            >
              <p class="font-bold text-lg">受取り</p>
            </Button>
          </Actions>
        </Dialog>
      {/if}
    </div>
  </div>
{/await}
