<script>
    export let onConfirm;
    export let onCancel;

    function handleConfirm() {
        onConfirm();
    }

    function handleCancel() {
        onCancel();
    }
</script>

<div class="modal z-50">
    <div class="modal-content">
        <slot></slot>
        <!-- Treść okna dialogowego -->
        <div class="modal-actions">
            <button on:click={handleConfirm}>Potwierdź</button>
            <button on:click={handleCancel}>Anuluj</button>
        </div>
    </div>
</div>

<style>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }

    .modal-actions {
        margin-top: 20px;
        display: flex;
        justify-content: flex-end;
        gap: 10px;
    }
</style>
