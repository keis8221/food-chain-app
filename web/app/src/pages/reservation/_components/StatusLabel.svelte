<script lang="ts">
  import { statusToText, type TReservation } from "../../../models/Reservation";
  import Badge from '@smui-extra/badge';

  export let status: TReservation["status"];
</script>

<Badge class="-mt-5 px-2 py-2" color="secondary">{statusToText[status]}</Badge>
