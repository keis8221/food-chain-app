<script lang="ts">
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import { addToast } from "../../../stores/Toast";
  import {
    ReservationRepository,
    statusToText,
    type TReservation,
  } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { goto, params } from "@roxi/routify";
  import dayjs from "dayjs";
  import Dialog, { Title, Content, Actions } from "@smui/dialog";
  import Button from "@smui/button";
  import StatusLabel from ".././_components/StatusLabel.svelte";
  import { onMount } from "svelte";
  import { AuthService } from "../../../services/AuthService";

  let reservationData: TReservation;
  let currentAccount: Record<string, string>;

  $: reservationRepository = new ReservationRepository();

  async function fetchReservationProducts() {
    try {
      return reservationRepository.findOne($params.id);
    } catch (err) {
      addToast({
        message:
          "予約の取得に失敗しました。もう一度時間をおいて再読み込みしてください。",
        type: "error",
      });
    }
  }

  onMount(async () => {
    currentAccount = await new AuthService().getProfile();
  });
</script>

{#await fetchReservationProducts()}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then reservationData}
  <div class="mt-3 flex justify-between">
    <h2 class="m-4 text-2xl font-bold">予約詳細</h2>
    <div class="m-2 mr-4">
      <StatusLabel status={reservationData.status} />
    </div>
  </div>
  <Content>
    <div class="reservationsBody">
      <div class="mb-2">
        <div class="text-lg font-bold">
          商品名：{reservationData.product.name}
        </div>
        <div class="text-lg font-bold">
          個数：{reservationData.quantity}
        </div>
      </div>
      <img
        class="w-[512px] h-auto"
        src={reservationData.product.image ??
          "https://girlydrop.com/wp-content/uploads/post/p5774.jpg"}
        alt=""
      />
      <div class="mt-4">
        <div class="text-lg font-bold">
          予約者名：{reservationData.consumer.name}
          <br />
          受け取り希望日時：{dayjs(reservationData.desiredAt).format(
            "YYYY-MM-DD"
          )}
          <br />
          受け取り場所：{reservationData.receiveLocation.name}
          <br />
          住所：{reservationData.receiveLocation.address}
        </div>
      </div>
    </div>
  </Content>
  <!-- {#if currentAccount.status === "staff"}
    <Actions>
      <Button class="mb-2" color="primary" variant="raised">
        <p class="font-bold text-lg">受け取り完了</p>
      </Button>
    </Actions>
  {/if} -->
{/await}

<style>
  div.mt-3 {
    margin: 1vh;
  }
  div.reservationsBody {
    margin: 1vh;
  }
</style>
