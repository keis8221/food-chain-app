<script lang="ts">
  import { onMount } from "svelte";
  import CircularProgress from "@smui/circular-progress";
  import Button from "@smui/button";
  import Textfield from "@smui/textfield";
  import { AccountService } from "../../services/AccountService";
  import { goto } from "@roxi/routify";
  import { setAccountProfile } from "../../stores/Account";
  import { addToast } from "../../stores/Toast";
  import { isLoggedIn, markAsLoginState } from "../../stores/Login";

  let email = "";
  let password = "";

  async function login() {
    await new AccountService()
      .login(email, password)
      .then((res) => {
        const {access_token, ...profile} = res;
        localStorage.setItem("accessToken", access_token);
        setAccountProfile(profile);
        $goto("/reservation");
        markAsLoginState();
        addToast({
          message: "ログインしました。",
          type: "success",
        });
      })
      .catch((err) => {
        addToast({
          message: err.message,
          type: "error",
        });
      });
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
  <form
    on:submit|preventDefault={login}
    class="grid justify-center mt-[10%] my-[50px]"
  >
    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="メールアドレス"
      bind:value={email}
      required
      type={"email"}
      input$maxlength={50}
      input$autocomplete="email"
    />

    <Textfield
      class="m-3 w-[300px]"
      variant="standard"
      label="パスワード"
      bind:value={password}
      required
      type={"password"}
      input$maxlength={50}
      input$autocomplete="current-password"
    />

    <Button
      class="login-btn mt-10 mx-14"
      color="secondary"
      variant="raised"
      type="submit"
    >
      <p class="black font-bold">ログイン</p>
    </Button>

    <div class="flex justify-center">
      <a class="text-text-lightGray mt-10" href="./signup/">アカウント作成</a>
    </div>
  </form>
{/if}
