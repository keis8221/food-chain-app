<script lang="ts">
  import { goto } from "@roxi/routify";
  import { onMount } from "svelte";
  import CircularProgress from "@smui/circular-progress";
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import Select, { Option } from "@smui/select";
  import IconButton from "@smui/icon-button";
  import CloseIcon from "../../components/icon/CloseIcon.svelte";
  import { addToast } from "../../stores/Toast";
  import { isLoggedIn } from "../../stores/Login";
  import { AccountService } from "../../services/AccountService";
  import { ShowableError } from "../../models/Error";
  import { encodeFileToBase64 } from "../../utils/file";
  import {
    USER_CLASSIFICATION,
    USER_CLASSIFICATION_LABEL,
    USER_ATTRIBUTE,
    USER_ATTRIBUTE_LABEL,
  } from "../../constants/account";

  let email = "";
  let password = "";
  let password_confirm = "";

  let classification: typeof USER_CLASSIFICATION[keyof typeof USER_CLASSIFICATION] =
    USER_CLASSIFICATION.individual;

  let attribute: typeof USER_ATTRIBUTE[keyof typeof USER_ATTRIBUTE] =
    USER_ATTRIBUTE.consumer;

  let name = "";
  let tel = "";
  let zipCode = "";
  let address = "";
  let remarks = "";
  let image = "";

  const FILE_LIMIT_SIZE = 5 * 1024 * 1024;

  async function onImgSelect(event: Event) {
    if (event.target instanceof HTMLInputElement) {
      const files = event.target.files;
      if (files[0].size > FILE_LIMIT_SIZE) {
        addToast({
          message: "画像ファイルのサイズは5MB以下にしてください。",
          type: "error",
        });
        return;
      }
      try {
        image = await encodeFileToBase64(files[0]);
      } catch {
        throw new ShowableError("画像の読み込みに失敗しました。");
      }
    }
  }

  function onImgDelete() {
    image = "";
  }

  async function signup() {
    if (password !== password_confirm) {
      addToast({
        message: "パスワードとパスワード（確認）が一致しません。",
        type: "error",
      });
    } else {
      await new AccountService()
        .signup({
          email,
          password,
          classification,
          attribute,
          name,
          tel,
          zipCode,
          address,
          remarks,
          image,
        })
        .then(() => {
          addToast({
            message: "アカウントを作成しました。",
            type: "success",
          });
          $goto("/login");
        })
        .catch((err) => {
          addToast({
            message: err.message,
            type: "error",
          });
        });
    }
  }

  onMount(() => {
    if ($isLoggedIn) {
      $goto("/reservation");
    }
  });
</script>

{#if $isLoggedIn}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:else}
  <form on:submit|preventDefault={signup} class="grid justify-center">
    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="メールアドレス"
      bind:value={email}
      required
      type={"email"}
      input$maxlength={50}
      input$autocomplete="email"
    >
      <HelperText slot="helper" persistent>例）example@ex.com</HelperText>
    </Textfield>

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="パスワード"
      bind:value={password}
      required
      type={"password"}
      input$maxlength={50}
      input$autocomplete="new-password"
    />

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="パスワード（確認）"
      bind:value={password_confirm}
      required
      type={"password"}
      input$maxlength={50}
      input$autocomplete="new-password"
    />

    <Select
      class="m-3 w-[300px]"
      variant="standard"
      label="区分"
      bind:value={classification}
      required
    >
      {#each Object.keys(USER_CLASSIFICATION) as clazz}
        <Option value={USER_CLASSIFICATION[clazz]}
          >{USER_CLASSIFICATION_LABEL[clazz]}</Option
        >
      {/each}
    </Select>

    <Select
      class="m-3 w-[300px]"
      variant="standard"
      label="属性"
      bind:value={attribute}
      required
    >
      {#each Object.keys(USER_ATTRIBUTE) as attr}
        <Option value={USER_ATTRIBUTE[attr]}
          >{USER_ATTRIBUTE_LABEL[attr]}</Option
        >
      {/each}
    </Select>

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="お名前"
      bind:value={name}
      required
      type={"text"}
      input$maxlength={30}
      input$autocomplete="name"
    >
      <HelperText slot="helper" persistent>
        {#if classification === USER_CLASSIFICATION.individual}
          例）鈴木太郎
        {:else if attribute === USER_ATTRIBUTE.producer}
          例）三種ファーム株式会社
        {:else if attribute === USER_ATTRIBUTE.consumer}
          例）三種フード株式会社
        {:else if attribute === USER_ATTRIBUTE.logistics}
          例）三種交通株式会社
        {/if}
      </HelperText>
    </Textfield>

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="電話番号"
      bind:value={tel}
      required
      type={"tel"}
      input$maxlength={14}
      input$pattern={"\\d{2,4}-\\d{2,4}-\\d{3,4}"}
      input$autocomplete="tel"
    >
      <HelperText slot="helper" persistent>例）000-0000-0000</HelperText>
    </Textfield>

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="郵便番号"
      bind:value={zipCode}
      required
      type={"text"}
      input$minlength={8}
      input$maxlength={8}
      input$pattern={"^\\d{3}-\\d{4}$"}
      input$autocomplete="shipping postal-code"
    >
      <HelperText slot="helper" persistent>例）000-0000</HelperText>
    </Textfield>

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="住所"
      bind:value={address}
      required
      type={"text"}
      input$maxlength={100}
      input$autocomplete="shipping address-level1 address-level2 address-level3 address-level4"
    >
      <HelperText slot="helper" persistent
        >例）秋田県山本郡三種町下岩川長面台50</HelperText
      >
    </Textfield>

    <div class="m-3">
      <div class="label required input-title text-text-lightGray">備考</div>
      <Textfield
        class="w-[300px]"
        bind:value={remarks}
        textarea
        input$maxlength={500}
        input$placeholder={attribute === USER_ATTRIBUTE.intermediary
          ? "例）営業時間、定休日"
          : ""}
      />
    </div>

    <div class="input-row m-3">
      <div class="label required input-title text-text-lightGray">画像</div>
      <div class="input-box">
        <div
          class="bg-white rounded-lg border-solid border-[1px] border-text-lightGray min-h-[200px] my-2 relative"
        >
          {#if !image}
            <div class="mt-16">
              <!-- <img class="mx-auto" src="/images/icons/upload.svg" alt="" /> -->
              <p class="text-text-lightGray font-bold text-sm text-center mt-6">
                画像ファイルをアップロード
              </p>
              <div class="text-center mt-2">
                <label
                  class="upload-button h-8 pt-2 px-3 mt-4 text-text-lightGray"
                >
                  ファイルを選択
                  <input
                    type="file"
                    accept="image/*"
                    class="hidden"
                    on:change={onImgSelect}
                  />
                </label>
              </div>
            </div>
          {:else}
            <div class="mb-9">
              <IconButton on:click={onImgDelete}>
                <CloseIcon />
              </IconButton>
              <div class="grid justify-center">
                <img
                  class="px-10"
                  src={image}
                  alt=""
                  width="360"
                  height="360"
                />
              </div>
            </div>
          {/if}
        </div>
        <div class="text-text-lightGray text-sm">
          最大アップロードサイズ:5MB
        </div>
      </div>
    </div>

    <div class="flex justify-center">
      <Button
        on:click={$goto("../login")}
        variant="raised"
        color="secondary"
        class="w-[100px]  px-4 py-2 mt-10 mr-4 rounded-full"
        type="button"
      >
        <p class="black">戻る</p>
      </Button>

      <Button
        variant="raised"
        color="secondary"
        class="w-[100px] px-4 py-2 mt-10 rounded-full"
        type="submit"
      >
        <p class="black">新規登録</p>
      </Button>
    </div>
  </form>
{/if}
