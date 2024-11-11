<script>
  import { page } from '$app/stores';
  import logo from "$lib/img/error.png";
</script>

<div style="height: 100vh; display: flex; justify-content: center; place-items: center;">
    <img alt="Error image" src="{logo}" style="height: 400px; border-radius: 40%;">
    <h1 style="width: 400px; margin-left: 20px;">{$page.status}: What you are looking for is not here. We're not hiding anything from you, but don't enter subpages that can't be accessed from the app's main menu.</h1>
</div>