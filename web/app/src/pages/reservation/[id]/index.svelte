<script lang="ts">
  import { goto } from "@roxi/routify";
  import { addToast } from "../../../stores/Toast";
  import {
    ReservationRepository,
    type TReservation,
    RESERVATION_STATUS
  } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import Button from "@smui/button";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import List, { Item, Graphic, Text } from '@smui/list';
  import Radio from '@smui/radio';
  import StatusLabel from ".././_components/StatusLabel.svelte";
  import { markAsLogoutState } from "../../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../../constants/product";
  import { profile } from "../../../stores/Account";
  import { AccountService } from "../../../services/AccountService";

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
    return RESERVATION_STATUS.packking === reservationStatus
      && reservation.product.producerId === $profile.id;
  }

  $: isShowKeptButton = (reservation) => {
    return RESERVATION_STATUS.shipping === reservationStatus
      && reservation.receiveLocationId === $profile.id;
  }

  $: isShowReceivedButton = (reservation) => {
    return RESERVATION_STATUS.keeping === reservationStatus
      && reservation.consumerId === $profile.id;
  }

  let isOpenPackedConfirmDialog = false;
  let isOpenKeptConfirmDialog = false;
  let isOpenReceivedConfirmDialog = false;

  let selectedShipperId = "";

  async function fetchLogistics() {
    try {
      const logistics = await new AccountService().getLogistics();
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
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then reservationData}
  <div class="grid justify-center">
    <div class="container">
      <div class="text-lg;">
        <p class="producer-image">
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
        <p class="producer-name">
          {reservationData.product.producer.name}
        </p>
      </div>
      <div class="product-status font-bold mt-5 mb-5 relative">
        <p class="product-name">
          {reservationData.product.name}
        </p>
        <p class="status-label">
          <StatusLabel bind:status={reservationStatus} />
        </p>
      </div>
    </div>

    <div class="reservation-info-body">
      <div class="product-image">
        <img
          class="w-[300px] h-auto"
          src={reservationData.product.image ??
            "./../../../public/images/default_product_image.png"}
          alt=""
        />
      </div>
      <table style="border:none; margin:0 auto;">
        <tbody style="border:none;">
          <tr style="border:none;">
            <td style="border:none;">数量</td>
            <td style="border:none;">：</td>
            <td style="border:none;"
              >{reservationData.quantity}{CROP_UNITS_LABEL[
                reservationData.product.unit
              ]}</td
            >
          </tr>
          <tr class="total-amount">
            <td style="border:none;">合計<wbr />金額</td>
            <td style="border:none;">：</td>
            <td style="border:none;"
              >{reservationData.product.unitPrice *
                reservationData.quantity}円</td
            >
          </tr>
          <tr style="border:none;">
            <td style="border:none;">予約者</td>
            <td style="border:none;">：</td>
            <td style="border:none;">{reservationData.consumer.name}</td>
          </tr>
          <tr style="border:none;">
            <td style="border:none;">希望日</td>
            <td style="border:none;">：</td>
            <td style="border:none;"
              >{dayjs(reservationData.desiredAt).format("YYYY/MM/DD")}</td
            >
          </tr>
          <tr style="border:none;">
            <td style="border:none;">場所</td>
            <td style="border:none;">：</td>
            <td style="border:none;"
              >{reservationData.receiveLocation.name}</td
            >
          </tr>
          <tr style="border:none;">
            <td style="border:none;" />
            <td style="border:none;" />
            <td style="border:none;"
              >{reservationData.receiveLocation.address}</td
            >
          </tr>
        </tbody>
      </table>
    </div>
    <div class="grid justify-center p-3 mt-3">
      {#if isShowPackedButton(reservationData) }
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
          <Title>
            配送者を選択して出荷しますか？
          </Title>
          <Content>
            {#await fetchLogistics()}
              <div style="display: flex; justify-content: center">
                <CircularProgress style="height: 160px; width: 32px;" indeterminate />
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
              variant="raised"
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
      {#if isShowKeptButton(reservationData) }
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
          <Title>店舗で作物を預かってますか？</Title>
          <Actions>
            <Button
              class="w-[150px]  px-4 py-2 rounded-full"
              color="secondary"
              variant="raised"
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
      {#if isShowReceivedButton(reservationData) }
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
              variant="raised"
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

<style>
  div.product-status {
    display: flex;
    justify-content: space-between;
  }
  p.product-name {
    font-size: 20px;
    text-align: left;
    display: flex;
    align-items: flex-end;
  }
  p.status-label {
    vertical-align: middle;
    text-align: right;
  }
  .producer-image {
    display: inline-block;
    vertical-align: middle;
  }
  p.producer-name {
    display: inline-block;
    vertical-align: middle;
  }
  .total-amount {
    border-bottom: 1px solid black;
  }
  div.product-image {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-bottom: 2vh;
  }
</style>
