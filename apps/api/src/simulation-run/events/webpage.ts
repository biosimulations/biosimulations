export const html = `<script type="text/javascript">
  const eventSource = new EventSource('/simulation-run-events/testId');
  eventSource.onmessage = ({ data }) => {
    const message = document.createElement('li');
    message.innerText = 'New message: ' + data;
    document.body.appendChild(message);
  };
</script>`;
