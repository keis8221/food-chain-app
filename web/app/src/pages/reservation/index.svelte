<script lang="ts">
  import { goto } from "@roxi/routify";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import {
    ReservationRepository,
    statusToText,
  } from "../../models/Reservation";
  import { addToast } from "../../stores/Toast";
  import CircularProgress from "@smui/circular-progress";
  import dayjs from "dayjs";
  import { markAsLogoutState } from "../../stores/Login";
  import { profile } from "../../stores/Account";
  import { USER_ATTRIBUTE } from "../../constants/account";

  $: reservationRepository = new ReservationRepository();

  async function fetchReservationProducts() {
    try {
      return await reservationRepository.allReservations();
    } catch (err) {
      switch (err.error || err.message) {
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
              "予約の取得に失敗しました。もう一度時間をおいて再読み込みしてください。",
            type: "error",
          });
          break;
      }
      return [];
    }
  }
</script>

{#await fetchReservationProducts()}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then items}
  <div class="m-6">
    <h2 class="text-2xl font-bold">予約一覧</h2>

    <DataTable class="mt-10" table$aria-label="User list" style="width: 100%">
      <Head>
        <Row>
          {#if $profile.attribute != USER_ATTRIBUTE.producer}
            <Cell style="text-align: center;">生産者</Cell>
          {/if}
          <Cell style="text-align: center;">作物名</Cell>
          <Cell style="text-align: center;">数量</Cell>
          <Cell style="text-align: center;">合計金額</Cell>
          {#if $profile.attribute != USER_ATTRIBUTE.consumer}
            <Cell style="text-align: center;">予約者</Cell>
          {/if}
          <Cell style="text-align: center;">受取り希望日</Cell>
          <Cell style="text-align: center;">受取り場所</Cell>
          <Cell style="text-align: center;">配送者</Cell>
          <Cell style="text-align: center;">ステータス</Cell>
        </Row>
      </Head>
      {#each items as item (item.id)}
        <Body class="cell">
          <Row on:click={$goto(`./${item.id}`)}>
            {#if $profile.attribute != USER_ATTRIBUTE.producer}
              <Cell style="text-align: center;"
                >{item.product.producer.name}</Cell
              >
            {/if}
            <Cell style="text-align: center;">{item.product.name}</Cell>
            <Cell style="text-align: center;">{item.quantity}</Cell>
            <Cell style="text-align: center;">{item.totalPrice}円</Cell>
            {#if $profile.attribute != USER_ATTRIBUTE.consumer}
              <Cell style="text-align: center;">{item.consumer.name}</Cell>
            {/if}
            <Cell style="text-align: center;"
              >{dayjs(item.desiredAt).format("YYYY/MM/DD")}</Cell
            >
            <Cell style="text-align: center;">{item.receiveLocation.name}</Cell>
            <Cell style="text-align: center;">{item.shipper?.name ?? ""}</Cell>
            <Cell style="text-align: center;">{statusToText[item.status]}</Cell>
          </Row>
        </Body>
      {/each}
    </DataTable>
  </div>
{/await}
