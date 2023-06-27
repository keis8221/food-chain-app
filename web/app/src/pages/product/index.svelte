<script lang="ts">
  import { goto } from "@roxi/routify";
  import Card, { Content, PrimaryAction, MediaContent } from "@smui/card";
  import Button from "@smui/button";
  import { ProductRepository, type TProduct } from "../../models/Product";
  import CircularProgress from "@smui/circular-progress";
  import { addToast } from "../../stores/Toast";
  import { markAsLogoutState } from "../../stores/Login";
  import { CROP_UNITS_LABEL } from "../../constants/product";
  import dayjs from "dayjs";

  $: productRepository = new ProductRepository();

  async function fetchProducts(): Promise<TProduct[]> {
    try {
      const products = await productRepository.all();
      return products;
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
      return [];
    }
  }
</script>

{#await fetchProducts()}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then products}
  <div class="m-6">
    <div class="flex justify-between"style="display: flex; justify-content: center">
      <Button
        color="secondary"
        variant="raised"
        class="w-[150px] px-4 py-2 mt-10 rounded-full"
        on:click={() => $goto("./new")}
      >
        <p class="black">出品</p>
      </Button>
    </div>

    <div class="card-display"style="width:100%">
      {#each products as product}
        <div class="card-container">
          <Card class="rounded-[24px]">
            <Content class="mdc-typography--body2 relative" style="top:10px">
              <div class="">
                <!-- TODO: imageタグ内の重複コードを解消する -->
                {#if product.producer.image}
                  <img
                    class="absolute top-0 w-[30px] h-[30px] rounded-[50%]"
                    src={product.producer.image}
                    alt=""
                  />
                {:else if product.producer.classification === "corporate"}
                  <img
                    class="absolute top-0 w-[30px] h-[30px] rounded-[50%]"
                    src="./../../../../public/images/house.png"
                    alt=""
                  />    
                {:else}
                  <img
                    class="absolute top-0 w-[30px] h-[30px] rounded-[50%]"
                    src="./../../../public/images/farmer.png"
                    alt=""
                  />
                {/if}
                <div
                  class="absolute text-sm top-[6%] left-[60px] text-[#4A4A4A]"
                >
                  {product.producer.name}

                </div>
                <div class="text-xl font-bold mt-4">
                  {product.name}
                </div>
              </div>
            </Content>
            <PrimaryAction on:click={$goto(`./${product.id}`)}>
              <div>
                <img
                  class="product-img"
                  src={product.image ??
                    "https://girlydrop.com/wp-content/uploads/post/p5774.jpg"}
                  alt=""
                />
                <MediaContent>
                  <div class="card-content" />
                </MediaContent>
              </div>
              <Content class="mdc-typography--body2 relative">
                <div class="price-block">
                  <div class="text-lg text-[#4A4A4A] mt-1">
                    {product.unitQuantity}{CROP_UNITS_LABEL[product.unit]}
                  </div>
                  <div>&nbsp;&nbsp;&nbsp;</div>
                  <div class="text-2xl text-[#4A4A4A]">
                    {product.unitPrice}
                  </div>
                  <div class="text-[#4A4A4A] mt-1.5">円</div>
                </div>
                <div class="text-lg text-[#4A4A4A] mt-1" style="float:left">
                  予約期間：
                <div style="float:right">{dayjs(product.startAt).format("MM/DD")}</div>
                <div style="float:right">〜</div>
                <div style="float:right">{dayjs(product.endAt).format("MM/DD")}</div>
                </div>
              </Content>
            </PrimaryAction>
          </Card>
        </div>
      {/each}
    </div>
  </div>
{/await}

<style lang="postcss">
  .card-display {
    @apply grid grid-cols-2 gap-16 mt-8 px-8;
  }

  .card-content {
    @apply bg-[#fff] absolute bottom-4 left-4;
  }

  .product-img {
    @apply h-auto w-full;
  }

  .price-block {
    @apply flex relative left-[40%];
  }
</style>
