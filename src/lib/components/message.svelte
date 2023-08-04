<script lang="ts">
	import type { MessageData } from "../../data/message";

    export let message : MessageData;
    let formatetedMessage = '';
    $: formatetedMessage = message.content.replace(/\n/g, '<br>');

    let imagePath = '';
    $: imagePath = message.role == 'assistant' ? '/public/police_captain.png': '/public/test-img.webp';
</script>

<!-- <div class="flex p-4"> -->
    <!-- <div class="pr-4"> -->
        <!-- <img src={imagePath} alt="test" class="w-10 h-10"> -->
    <!-- </div> -->
    <!-- <div class="text-left"> -->
        <!-- {@html formatetedMessage} -->
    <!-- </div> -->
<!-- </div> -->
<div class="flex p-4 items-start">
    <div class="flex-none pr-4">
        <img src={imagePath} alt="test" class="w-10 h-10 object-cover">
    </div>
    <div class="text-left flex-grow">
        {@html formatetedMessage}
    </div>
</div>
