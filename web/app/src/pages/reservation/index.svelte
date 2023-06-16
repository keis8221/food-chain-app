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
  import Dialog, { Content, Actions } from "@smui/dialog";
  import Button from "@smui/button";
  import StatusLabel from "./_components/StatusLabel.svelte";
  import { onMount } from "svelte";
  import { AccountService } from "../../services/AccountService";
  import { markAsLogoutState } from "../../stores/Login";

  let open = false;
  let dialogData: TReservation;
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

  function showDetail(reservation: TReservation) {
    dialogData = reservation;
    open = true;
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
          <Row on:click={() => showDetail(item)}>
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

{#if dialogData && open}
  <Dialog bind:open on:closed={(dialogData = undefined)}>
    <div class="mt-3 flex justify-between">
      <h2 class="m-4 text-2xl font-bold">予約詳細</h2>
      <div class="m-2 mr-4">
        <StatusLabel status={dialogData.status} />
      </div>
    </div>
    <Content>
      <div class="mb-2">
        <div class="text-lg font-bold">
          商品名：{dialogData.product.name}
        </div>
        <div class="text-lg font-bold">
          個数：{dialogData.quantity}
        </div>
      </div>
      <img
        class="w-[512px] h-auto"
        src={dialogData.product.image ??
          "https://girlydrop.com/wp-content/uploads/post/p5774.jpg"}
        alt=""
      />
      <div class="mt-4">
        <div class="text-lg font-bold">
          予約者名：{dialogData.consumer?.name}
          <br />
          受け取り希望日時：{dayjs(dialogData.desiredAt).format(
            "MM/DD HH:mm"
          )}
          <br />
          受け取り場所：{dialogData.receiveLocation.name}
          <br />
          住所：{dialogData.receiveLocation.address}
        </div>
      </div>
    </Content>
    {#if currentAccount.status === "staff"}
      <Actions>
        <Button class="mb-2" color="primary" variant="raised">
          <p class="font-bold text-lg">受け取り完了</p>
        </Button>
      </Actions>
    {/if}
  </Dialog>
{/if}
