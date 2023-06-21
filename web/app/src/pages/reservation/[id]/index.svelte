<script lang="ts">
  import { addToast } from "../../../stores/Toast";
  import { ReservationRepository } from "../../../models/Reservation";
  import CircularProgress from "@smui/circular-progress";
  import { params } from "@roxi/routify";
  import dayjs from "dayjs";
  import { Content } from "@smui/dialog";
  import StatusLabel from ".././_components/StatusLabel.svelte";

  $: reservationRepository = new ReservationRepository();

  // 単位日本語化
  export const CROP_UNITS_TEXT = {
    gram: "g",
    stalk: "本",
    piece: "個",
    portion: "玉",
    share: "株",
    bundle: "束",
    pile: "山",
    pack: "パック",
    bag: "袋",
  };

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
</script>

{#await fetchReservationProducts()}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then reservationData}
  <div class="mt-3 flex justify-between">
    <!-- <h2 class="m-4 text-2xl font-bold">予約詳細</h2> -->
    <div class="m-2 mr-4">
      <StatusLabel status={reservationData.status} />
    </div>
  </div>
  <Content>
    <div class="reservationsBody">
      <div class="mb-2">
        <div class="text-lg">
          <p class="producer-image">
            <img
              class="w-[40px] h-[40px]"
              src="./../../../../public/images/farmer.png"
              alt=""
            />
          </p>
          <!-- 生産者名 -->
          <p class="producer-name">
            {reservationData.product.producer.name}
          </p>
        </div>
        <div class="text-lg font-bold">
          {reservationData.product.name}
        </div>
        <img
          class="w-[512px] h-auto"
          src={reservationData.product.image ??
            "https://girlydrop.com/wp-content/uploads/post/p5774.jpg"}
          alt=""
        />
      </div>

      <div class="mt-4">
        <div class="reservation-info font-bold">
          <p>
            <span class="col">数量</span>：{reservationData.quantity}
            {CROP_UNITS_TEXT[reservationData.product.unit]}
            <br />
            <span class="col">合計金額</span>：{reservationData.product
              .unitPrice * reservationData.quantity}円
            <br />
          </p>
          <hr />
          <p>
            <span class="col">予約者</span>：{reservationData.consumer.name}
            <br />
            <span class="col">希望日</span>：{dayjs(
              reservationData.desiredAt
            ).format("YYYY/MM/DD")}
            <br />
            <span class="col">場所</span>：{reservationData.receiveLocation
              .name}
            <br />
            <span class="col-address" />{reservationData.receiveLocation
              .address}
          </p>
        </div>
      </div>
    </div>
  </Content>
{/await}

<style>
  div.mt-3 {
    margin: 1vh;
  }
  div.reservationsBody {
    margin: 1vh;
  }
  .producer-image {
    display: inline-block;
    vertical-align: middle;
  }
  p.producer-name {
    display: inline-block;
    vertical-align: middle;
    margin-left: 15px;
  }
  div.reservation-info p {
    padding: 10px;
  }
  div.reservation-info .col {
    display: inline-block;
    width: 120px;
    line-height: 19px;
  }
  div.reservation-info .col-address {
    display: inline-block;
    width: 135px;
    line-height: 19px;
  }
</style>
