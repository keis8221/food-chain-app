<script lang="ts">
  import { goto } from "@roxi/routify";
  import { addToast } from "../../../stores/Toast";
  import { ReservationRepository } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { Content } from "@smui/dialog";
  import StatusLabel from ".././_components/StatusLabel.svelte";
  import { markAsLogoutState } from "../../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../../constants/product";

  $: reservationRepository = new ReservationRepository();

  async function fetchReservationProducts() {
    try {
      return await reservationRepository.findOne($params.id);
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
      return null;
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
            <StatusLabel status={reservationData.status} />
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
