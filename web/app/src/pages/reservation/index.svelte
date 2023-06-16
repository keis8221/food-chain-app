<script lang="ts">
  import { goto } from "@roxi/routify";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import {
    ReservationRepository,
    statusToText,
    type TReservation,
  } from "../../models/Reservation";
  import { addToast } from "../../stores/Toast";
  import CircularProgress from "@smui/circular-progress";
  import dayjs from "dayjs";
  import { onMount } from "svelte";
  import { AccountService } from "../../services/AccountService";
  import { markAsLogoutState } from "../../stores/Login";

  let currentAccount: Record<string, string>;

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

  onMount(async () => {
    currentAccount = await new AccountService().getProfile();
  });
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
          <Cell>予約者名</Cell>
          <Cell>受け取り希望日時</Cell>
          <Cell>受け取り場所</Cell>
          <Cell>予約商品</Cell>
          <Cell>個数</Cell>
          <Cell>ステータス</Cell>
        </Row>
      </Head>
      {#each items as item (item.id)}
        <Body class="cell">
          <Row on:click={ $goto(`./${item}`)}>
            <Cell>{item.consumer?.name}</Cell>
            <Cell
              >{dayjs(item.desiredAt).format("MM/DD HH:mm")}</Cell
            >
            <Cell>{item.receiveLocation.name}</Cell>
            <Cell>{item.product.name}</Cell>
            <Cell>{item.quantity}</Cell>
            <Cell>{statusToText[item.status]}</Cell>
          </Row>
        </Body>
      {/each}
    </DataTable>
  </div>
{/await}
