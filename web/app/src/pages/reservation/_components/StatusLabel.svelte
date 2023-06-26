<script lang="ts">
  import { statusToText, type TReservation } from "../../../models/Reservation";
  import Badge from '@smui-extra/badge';

  export let status: TReservation["status"];
</script>

<Badge position=inset align=middle-middle class="px-4 py-2" color="secondary">{statusToText[status]}</Badge>
