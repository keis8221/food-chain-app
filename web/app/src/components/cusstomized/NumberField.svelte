<script lang="ts">
  import Textfield from "@smui/textfield";
  import HelperText from "@smui/textfield/helper-text";
  import { createField } from "felte";

  export let name: string;
  export let helperText = "";
  export let label = "";
  export let textValue: number;
  export let onChange = undefined;

  const { field, onInput, onBlur } = createField(name);

  $: onInput(textValue);
</script>

<div use:field on:blur={onBlur} role="textbox">
  <Textfield
    bind:value={textValue}
    {label}
    variant="standard"
    type="number"
    on:change={onChange}
  >
    {#if helperText}
      <HelperText slot="helper">
        {helperText}
      </HelperText>
    {/if}
  </Textfield>
</div>
