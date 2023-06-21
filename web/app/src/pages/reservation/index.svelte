<script lang="ts">
  import { goto } from "@roxi/routify";
  import DataTable, { Head, Body, Row, Cell } from "@smui/data-table";
  import {
    ReservationRepository,
    statusToText,
    type TReservation,
  } from "../../models/Reservation";
  import { addToast } from "../../stores/Toast";
  import CircularProgress from "@smui/circular-progress";
  import dayjs from "dayjs";
  import { markAsLogoutState } from "../../stores/Login";
  import { profile } from "../../stores/Account";
  import { ATTRIBUTE } from "../../constants/account";

  /**
   * 表を構成する全ての要素を格納した配列オブジェクト
   *
   * {
   *   headerText: ヘッダー文字列
   *   visibleAttributes: 要素を表示可能なユーザー属性の配列
   *   valueKeyPath: 要素の値を取得可能なキーのパス
   *   notation: 特別な表示記法を施す関数
   * }
   */
  const ALL_TABLE_ELEMENTS = [
    {
      headerText: "生産者名",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER, 
        ATTRIBUTE.LOGISTICS
      ],
      valueKeyPath: "product.producer.name",
    },
    {
      headerText: "作物名",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "product.name",
    },
    {
      headerText: "予約数量",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "quantity",
    },
    {
      headerText: "合計金額",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "totalPrice",
      notation: (value) => `${value}円`,
    },
    {
      headerText: "予約者名",
      visibleAttributes: [
        ATTRIBUTE.PRODUCER, 
        ATTRIBUTE.LOGISTICS
      ],
      valueKeyPath: "consumer.name",
    },
    {
      headerText: "受取り希望日",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "desiredAt",
      notation: (value) => dayjs(value).format("YYYY/MM/DD"),
    },
    {
      headerText: "受取り場所",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "receiveLocation.name",
    },
    {
      headerText: "配送者",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "shipper.name",
    },
    {
      headerText: "ステータス",
      visibleAttributes: [
        ATTRIBUTE.CONSUMER,
        ATTRIBUTE.PRODUCER,
        ATTRIBUTE.LOGISTICS,
      ],
      valueKeyPath: "status",
      notation: (value) => statusToText[value],
    },
  ];

  $: reservationRepository = new ReservationRepository();

  async function fetchReservationProducts() {
    try {
      return await reservationRepository.allReservations();
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
      return [];
    }
  }

  /**
   * ユーザーの属性に応じた表の要素群を返す.
   *
   * @return {Array<Object>} 表の要素群
   */
  function getTableElementsForCurrentAttribute() {
    const tableElementsForCurrentAttribute = new Array();
    ALL_TABLE_ELEMENTS.forEach((tableElement) => {
      if (!tableElement.visibleAttributes.includes($profile.attribute)) {
        return;
      }
      
      tableElementsForCurrentAttribute.push(tableElement);
    });

    return tableElementsForCurrentAttribute;
  }

  /**
   * 表の1行分の情報を取得する.
   *
   * @param {TReservation} item - 1行分の予約情報
   * @param {Array<Object>} columns - 表の要素群(列の情報として扱う)
   * @return {Array<any>} 表の1行分の情報
   */
  function getTableRow(item, columns) {
    const tableRow = new Array();
    columns.forEach((column) => {
      var value = getValue(item, column.valueKeyPath);

      // 記法が指定されていれば値を修正する
      if (column.notation) {
        value = column.notation(value);
      }

      tableRow.push(value);
    });

    return tableRow;
  }

  /**
   * 指定されたキーパス文字列から、値を取得する
   *
   * @param {TReservation} item - 予約情報
   * @param {string} keyPath - キーパス文字列
   * @return {any} 指定されたキーパスから取得した文字列
   */
  function getValue(item, keyPath) {
    const keyPathArray = keyPath.split(".");
    var value = item;
    for (var i = 0; i < keyPathArray.length; i++) {
      value = value[keyPathArray[i]];
      if (!value) {
        return "";
      }
    }

    return value;
  }
</script>

{#await fetchReservationProducts()}
  <div style="display: flex; justify-content: center">
    <CircularProgress style="height: 160px; width: 32px;" indeterminate />
  </div>
{:then items}
  <div class="m-6">
    <h2 class="text-2xl font-bold">予約一覧</h2>

    <DataTable class="mt-10" table$aria-label="User list" style="width: 100%">
      {@const columns = getTableElementsForCurrentAttribute()}
      <Head>
        <Row>
          {#each columns as column}
            <Cell style="text-align: center;">{column.headerText}</Cell>
          {/each}
        </Row>
      </Head>
      {#each items as item (item.id)}
        <Body class="cell">
          <Row on:click={$goto(`./${item}`)}>
            {#each getTableRow(item, columns) as value}
              <Cell style="text-align: center;">{value}</Cell>
            {/each}
          </Row>
        </Body>
      {/each}
    </DataTable>
  </div>
{/await}
