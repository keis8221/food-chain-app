<script lang="ts">
  import { goto, params } from "@roxi/routify";
  import { ProductRepository, type TProduct } from "../../../models/Product";
  import CircularProgress from "@smui/circular-progress";
  import Paper from "@smui/paper";
  import Button from "@smui/button";
  import { addToast } from "../../../stores/Toast";
  import { markAsLogoutState } from "../../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../../constants/product";
  import dayjs from "dayjs";
  import { USER_ATTRIBUTE } from "../../../constants/account";
  import { profile } from "../../../stores/Account";

  async function fetchProduct(): Promise<TProduct> {
    try {
      return await new ProductRepository().findOne($params.id);
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
              "商品の取得に失敗しました。もう一度時間をおいて再読み込みしてください。",
            type: "error",
          });
          break;
      }
      return null;
    }
  }

  function isOutOfStock(product: TProduct): boolean {
    return product.remaining <= 0;
  }
</script>

{#await fetchProduct()}
  <div class="flex justify-center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then product}
  <div class="grid justify-center">
    <div class="container">
      <div class="flex">
        {#if product.producer.image}
          <img
            class="w-[40px] h-[40px] rounded-[50%]"
            src={product.producer.image}
            alt=""
          />
        {:else if product.producer.classification === "individual"}
          <img
            class="w-[40px] h-[40px] rounded-[50%]"
            src="./../../../public/images/farmer.png"
            alt=""
          />
        {:else if product.producer.classification === "corporate"}
          <img
            class="w-[40px] h-[40px] rounded-[50%]"
            src="./../../../public/images/house.png"
            alt=""
          />
        {/if}
        <div class="ml-4 mt-3">
          <div class="text-xl text-[#8A8A8A]">
            {product.producer.name}
          </div>
        </div>
      </div>
      <div class="mt-3 flex justify-between items-center">
        <h1 class="text-2xl font-bold text-[#5A5A5A]">
          {product.name}
        </h1>
        {#if isOutOfStock(product)}
          <p class="text-[#ff0000] text-xl">終了</p>
        {/if}
      </div>
      <img
        src={product.image ??
          "./../../../public/images/default_product_image.png"}
        alt=""
        width="300"
        class="mt-3"
      />
    </div>

    <fieldset class="p-3 w-[300px] border border-secondary rounded">
      <legend>説明</legend>
      {product.description}
    </fieldset>

    <Paper class="mt-3 w-[300px]" color="secondary" variant="outlined">
      <div class="text-center text-base text-[#5A5A5A] mt-2">
        {product.unitQuantity}{CROP_UNITS_LABEL[
          product.unit
        ]}あたり{product.unitPrice}円
      </div>
      <div class="text-center text-base text-[#5A5A5A] mt-2">
        残りあと{product.remaining}点
      </div>
      <div class="text-center text-base text-[#5A5A5A] mt-2">
        予約期間：
        {dayjs(product.startAt).format("MM/DD HH:mm")}
        -
        {dayjs(product.endAt).format("MM/DD HH:mm")}
      </div>
    </Paper>

    {#if $profile.attribute === USER_ATTRIBUTE.consumer && !isOutOfStock(product)}
      <div class="flex justify-center">
        <Button
          variant="raised"
          class="w-[150px] px-4 py-2 mt-10 rounded-full"
          color="secondary"
          on:click={$goto("../../reservation/new", { productId: $params.id })}
        >
          <p class="black">予約</p>
        </Button>
      </div>
    {/if}
  </div>
{/await}
