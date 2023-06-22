<script lang="ts">
  import { goto } from "@roxi/routify";
  import { addToast } from "../../../stores/Toast";
  import {
    ReservationRepository,
    type TReservation,
  } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import Button from "@smui/button";
  import { Content } from "@smui/dialog";
  import StatusLabel from ".././_components/StatusLabel.svelte";
  import { markAsLogoutState } from "../../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../../constants/product";
  import { profile } from "../../../stores/Account";

  // 仮置き。reservation_index取り込んだら消えるよ。
  const USER_ATTRIBUTE = {
    producer: "producer",
    consumer: "consumer",
    logistics: "logistics",
    intermediary: "intermediary",
  };

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

  async function packed() {
    console.log("出荷ボタンが押された");
    // ここのガード処理いるか？ボタンのvisiblityで充分じゃないか？
    if ($profile.attribute !== USER_ATTRIBUTE.producer) {
      addToast({
        message: "無効なユーザー属性です。",
        type: "error",
      });
      return;
    }

    // ひとまず生産者自身を配送者に設定しとく
    const shipperId = $profile.id;

    try {
      const updateReservationData = await reservationRepository.packed(
        $params.id,
        { shipperId: shipperId }
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約商品の出荷が完了しました。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  async function kept() {
    console.log("店舗預かりボタンが押された");
    // ここのガード処理いるか？ボタンのvisiblityで充分じゃないか？
    if ($profile.attribute !== USER_ATTRIBUTE.intermediary) {
      addToast({
        message: "無効なユーザー属性です。",
        type: "error",
      });
      return;
    }

    try {
      const updateReservationData = await reservationRepository.kept(
        $params.id
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約商品の店舗預かりが完了しました。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  async function received() {
    console.log("受取りボタンが押された");
    // ここのガード処理いるか？ボタンのvisiblityで充分じゃないか？
    if ($profile.attribute !== USER_ATTRIBUTE.consumer) {
      addToast({
        message: "無効なユーザー属性です。",
      });
      return;
    }

    try {
      const updateReservationData = await reservationRepository.received(
        $params.id
      );
      reservationStatus = updateReservationData.status;
      addToast({
        message: "予約商品の受取りを完了しました。",
      });
    } catch (err) {
      handleError(err);
    }
  }

  function handleError(err) {
    switch (err.error || err.message) {
      case "Bad Request":
        addToast({
          message: "予約の更新に失敗しました。開発者へお問い合わせください。", // 400 Bad Request が返る = ガード条件不備のフロントエンド実装ミス
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
  <Content>
    <div class="grid justify-center">
      <div class="container">
        <div class="text-lg;">
          <p class="producer-image">
            {#if reservationData.product.producer.classification == "individual"}
              <img
                class="w-[40px] h-[40px]"
                src="./../../../public/images/individual_icon.png"
                alt=""
              />
            {:else if reservationData.product.producer.classification == "corporate"}
              <img
                class="w-[40px] h-[40px]"
                src="./../../../public/images/corporate_icon.png"
                alt=""
              />
            {/if}
          </p>
          <p class="producer-name">
            {reservationData.product.producer.name}
          </p>
        </div>
        <div class="product-status font-bold mt-5 mb-5">
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
      <!-- ボタンは並べただけ。 -->
      <Button
        class="mt-14 px-7 h-12"
        color="secondary"
        variant="raised"
        on:click={packed}
      >
        <p class="text-lg font-bold">出荷</p>
      </Button>
      <Button
        class="mt-14 px-7 h-12"
        color="secondary"
        variant="raised"
        on:click={kept}
      >
        <p class="text-lg font-bold">店舗預かり</p>
      </Button>
      <Button
        class="mt-14 px-7 h-12"
        color="secondary"
        variant="raised"
        on:click={received}
      >
        <p class="text-lg font-bold">受取り</p>
      </Button>
    </div>
  </Content>
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
