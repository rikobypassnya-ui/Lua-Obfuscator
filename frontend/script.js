async function encode() {
  const file = document.getElementById("file").files[0];
  const form = new FormData();
  form.append("file", file);

  const res = await fetch("http://localhost:3000/api/encode", {
    method: "POST",
    headers: {
      "x-api-key": "RFWLUA-SECRET-KEY"
    },
    body: form
  });

  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "result.zip";
  a.click();
}
