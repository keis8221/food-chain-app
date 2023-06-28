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
    <div class="flex justify-center">
      <Button
        color="secondary"
        variant="raised"
        class="w-[150px] px-4 py-2 mt-10 rounded-full"
      >
        <p class="black">出品</p>
      </Button>
    </div>

    <div class="container my-12 mx-auto px-4 md:px-12">
      <div class="flex flex-wrap -mx-1 lg:-mx-4">
      {#each products as product}
        <div class="my-1 px-1 sm:flex sm:justify-center sm:w-full md:w-1/2 lg:my-4 lg:px-4 lg:w-1/3 xl:w-1/4 flex width=270px max-width=100%">
          <Card class="rounded-[24px] width=270px max-width=100% "on:click={$goto(`./${product.id}`)} >
            <Content class="mdc-typography--body2 relative top-[10px]">
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
                <div class="text-xl font-bold mt-4"style="text-overflow: ellipsis max-width=100%">
                  {product.name}
                </div>
              </div>
            </Content>
            <PrimaryAction on:click={$goto(`./${product.id}`)} class="h-full">
              <div>
                <img
                  class="block h-48 w-96 object-contain"
                  src={product.image ??
                    "https://girlydrop.com/wp-content/uploads/post/p5774.jpg"}
                  alt=""
                />
              </div>
              <Content class="mdc-typography--body2 relative">
                <div class="flex justify-center">
                  <div class="text-lg text-[#4A4A4A] mt-1">
                    {product.unitQuantity}{CROP_UNITS_LABEL[product.unit]}
                  </div>
                  <div class="text-2xl text-[#4A4A4A] ml-5">
                    {product.unitPrice} 円
                  </div>
                </div>
                <div class="text-lg text-[#4A4A4A] mt-1 flex justify-center" >
                  予約期間：
                <div >{dayjs(product.startAt).format("MM/DD")}</div>
                <div >〜</div>
                <div >{dayjs(product.endAt).format("MM/DD")}</div>
                </div>
              </Content>
            </PrimaryAction>
          </Card>
        </div>
      {/each}
    </div>
    </div>
  </div>
{/await}