const STORAGE_KEY = "inventario_registros_v1";

const state = {
  records: [],
  searchTerm: "",
  stream: null,
  scannerOpen: false,
  scanTimer: null,
  scanCanvas: null,
  scanCtx: null,
  scanAttempts: 0,
};

const els = {
  form: document.getElementById("inventoryForm"),
  productType: document.getElementById("productType"),
  customTypeWrap: document.getElementById("customTypeWrap"),
  customType: document.getElementById("customType"),
  productName: document.getElementById("productName"),
  barcodeInput: document.getElementById("barcodeInput"),
  quantity: document.getElementById("quantity"),
  location: document.getElementById("location"),
  summaryGrid: document.getElementById("summaryGrid"),
  recordsList: document.getElementById("recordsList"),
  recordCount: document.getElementById("recordCount"),
  searchInput: document.getElementById("searchInput"),
  exportCsvBtn: document.getElementById("exportCsvBtn"),
  clearBtn: document.getElementById("clearBtn"),
  scanBtn: document.getElementById("scanBtn"),
  scannerModal: document.getElementById("scannerModal"),
  scannerStatus: document.getElementById("scannerStatus"),
  scannerVideo: document.getElementById("scannerVideo"),
  closeScannerBtn: document.getElementById("closeScannerBtn"),
  goPortalBtn: document.getElementById("goPortalBtn"),
};

function loadRecords() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;

  try {
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      state.records = parsed;
    }
  } catch (_) {
    state.records = [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.records));
}

function formatDate(iso) {
  const dt = new Date(iso);
  if (Number.isNaN(dt.getTime())) return "sin fecha";
  return dt.toLocaleString("es-MX", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getProductType() {
  if (els.productType.value !== "Otro") {
    return els.productType.value.trim();
  }
  return els.customType.value.trim();
}

function renderSummary() {
  if (state.records.length === 0) {
    els.summaryGrid.innerHTML = '<div class="empty">Aun no hay tipos capturados.</div>';
    return;
  }

  const grouped = state.records.reduce((acc, item) => {
    if (!acc[item.productType]) {
      acc[item.productType] = 0;
    }
    acc[item.productType] += Number(item.quantity) || 0;
    return acc;
  }, {});

  const cards = Object.entries(grouped)
    .sort((a, b) => b[1] - a[1])
    .map(([type, totalQty]) => {
      return `
        <article class="summary-item">
          <p class="summary-item__type">${escapeHtml(type)}</p>
          <p class="summary-item__qty">${totalQty}</p>
        </article>
      `;
    })
    .join("");

  els.summaryGrid.innerHTML = cards;
}

function renderRecords() {
  const normalizedSearch = state.searchTerm.trim().toLowerCase();
  const filteredRecords = state.records.filter((item) => {
    if (!normalizedSearch) return true;
    return [item.productType, item.productName, item.barcode, item.location]
      .join(" ")
      .toLowerCase()
      .includes(normalizedSearch);
  });

  if (normalizedSearch) {
    els.recordCount.textContent = `${filteredRecords.length} de ${state.records.length} items`;
  } else {
    els.recordCount.textContent = `${state.records.length} items`;
  }

  if (state.records.length === 0) {
    els.recordsList.innerHTML = '<div class="empty">No hay registros en inventario.</div>';
    return;
  }

  if (filteredRecords.length === 0) {
    els.recordsList.innerHTML = '<div class="empty">No se encontraron coincidencias para tu busqueda.</div>';
    return;
  }

  const rows = filteredRecords
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((item) => {
      return `
        <article class="record-item">
          <h4 class="record-title">${escapeHtml(item.productName)}</h4>
          <p class="record-meta">Codigo: ${escapeHtml(item.barcode)} | Cantidad: ${item.quantity}</p>
          <p class="record-meta">Ubicacion: ${escapeHtml(item.location || "Sin ubicacion")}</p>
          <p class="record-meta">Fecha: ${formatDate(item.createdAt)}</p>
          <span class="record-pill">${escapeHtml(item.productType)}</span>
        </article>
      `;
    })
    .join("");

  els.recordsList.innerHTML = rows;
}

function renderAll() {
  renderSummary();
  renderRecords();
}

function resetFormAfterSave() {
  els.form.reset();
  els.quantity.value = "1";
  els.customTypeWrap.classList.add("hidden");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function onSubmitForm(event) {
  event.preventDefault();

  const productType = getProductType();
  const productName = els.productName.value.trim();
  const barcode = els.barcodeInput.value.trim();
  const quantity = Number(els.quantity.value);
  const location = els.location.value.trim();

  if (!productType || !productName || !barcode || !Number.isInteger(quantity) || quantity < 1) {
    alert("Completa todos los campos obligatorios con valores validos.");
    return;
  }

  state.records.push({
    id: crypto.randomUUID(),
    productType,
    productName,
    barcode,
    quantity,
    location,
    createdAt: new Date().toISOString(),
  });

  saveRecords();
  renderAll();
  resetFormAfterSave();
}

function toggleCustomType() {
  const shouldShow = els.productType.value === "Otro";
  els.customTypeWrap.classList.toggle("hidden", !shouldShow);
  if (!shouldShow) {
    els.customType.value = "";
  }
}

function clearAllRecords() {
  if (state.records.length === 0) return;
  const confirmed = confirm("Esto eliminara todos los registros de inventario. Continuar?");
  if (!confirmed) return;

  state.records = [];
  saveRecords();
  renderAll();
}

function escapeCsvValue(value) {
  const text = String(value ?? "").replaceAll('"', '""');
  return `"${text}"`;
}

function buildCsv(rows) {
  const header = ["tipo_producto", "nombre_producto", "codigo_barras", "cantidad", "ubicacion", "fecha_registro"];
  const lines = [header.join(",")];

  rows.forEach((item) => {
    lines.push(
      [
        escapeCsvValue(item.productType),
        escapeCsvValue(item.productName),
        escapeCsvValue(item.barcode),
        escapeCsvValue(item.quantity),
        escapeCsvValue(item.location || ""),
        escapeCsvValue(item.createdAt),
      ].join(",")
    );
  });

  return lines.join("\n");
}

function downloadCsv() {
  if (state.records.length === 0) {
    alert("No hay registros para exportar.");
    return;
  }

  const csv = buildCsv(state.records);
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const now = new Date();
  const stamp = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  const a = document.createElement("a");
  a.href = url;
  a.download = `inventario-${stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}

function updateScannerStatus(msg) {
  els.scannerStatus.textContent = msg;
}

function ensureScanCanvas(width, height) {
  const safeWidth = Math.max(1, Math.round(width));
  const safeHeight = Math.max(1, Math.round(height));

  if (!state.scanCanvas) {
    state.scanCanvas = document.createElement("canvas");
    state.scanCtx = state.scanCanvas.getContext("2d", { willReadFrequently: true });
  }

  if (state.scanCanvas.width !== safeWidth || state.scanCanvas.height !== safeHeight) {
    state.scanCanvas.width = safeWidth;
    state.scanCanvas.height = safeHeight;
  }
}

function getScanRegion(videoWidth, videoHeight, useCenterCrop) {
  if (!useCenterCrop) {
    return {
      sx: 0,
      sy: 0,
      sw: videoWidth,
      sh: videoHeight,
    };
  }

  const cropWidth = videoWidth * 0.76;
  const cropHeight = videoHeight * 0.38;

  return {
    sx: (videoWidth - cropWidth) / 2,
    sy: (videoHeight - cropHeight) / 2,
    sw: cropWidth,
    sh: cropHeight,
  };
}

function captureFrameImageData(video, useCenterCrop) {
  const region = getScanRegion(video.videoWidth, video.videoHeight, useCenterCrop);
  const maxDecodeWidth = useCenterCrop ? 1280 : 960;
  const scale = Math.min(1, maxDecodeWidth / region.sw);
  const targetWidth = region.sw * scale;
  const targetHeight = region.sh * scale;

  ensureScanCanvas(targetWidth, targetHeight);
  state.scanCtx.drawImage(
    video,
    region.sx,
    region.sy,
    region.sw,
    region.sh,
    0,
    0,
    state.scanCanvas.width,
    state.scanCanvas.height
  );

  return state.scanCtx.getImageData(0, 0, state.scanCanvas.width, state.scanCanvas.height);
}

async function decodeImageData(imageData) {
  return window.ZXingWASM.readBarcodes(imageData, {
    formats: ["AllLinear"],
    tryHarder: true,
    tryRotate: true,
    tryInvert: true,
    tryDownscale: true,
    tryDenoise: false,
    downscaleFactor: 2,
    downscaleThreshold: 1200,
    minLineCount: 1,
    maxNumberOfSymbols: 1,
    binarizer: "LocalAverage",
    textMode: "Plain",
  });
}

function closeScanner() {
  state.scannerOpen = false;
  state.scanAttempts = 0;
  els.scannerModal.classList.remove("open");
  els.scannerModal.setAttribute("aria-hidden", "true");

  if (state.scanTimer) {
    clearTimeout(state.scanTimer);
    state.scanTimer = null;
  }

  if (state.stream) {
    state.stream.getTracks().forEach((track) => track.stop());
    state.stream = null;
  }

  els.scannerVideo.srcObject = null;
}

async function scanFrame() {
  if (!state.scannerOpen || !state.scanCanvas || !state.scanCtx) return;

  const video = els.scannerVideo;
  if (!video.videoWidth || !video.videoHeight || video.readyState < 2) {
    state.scanTimer = setTimeout(scanFrame, 180);
    return;
  }

  state.scanAttempts += 1;
  const useCenterCrop = state.scanAttempts % 4 !== 0;
  const imageData = captureFrameImageData(video, useCenterCrop);

  try {
    const barcodes = await decodeImageData(imageData);

    if (barcodes.length > 0 && barcodes[0].text) {
      els.barcodeInput.value = barcodes[0].text;
      updateScannerStatus(`Codigo detectado: ${barcodes[0].text}`);
      closeScanner();
      return;
    }
    if (state.scanAttempts % 6 === 0) {
      updateScannerStatus("Buscando codigo... acerca un poco mas la camara y evita reflejos.");
    }
  } catch (error) {
    const message = error && error.message ? error.message : "Analizando imagen con zxing-wasm...";
    updateScannerStatus(message);
  }

  state.scanTimer = setTimeout(scanFrame, 160);
}

async function openScanner() {
  if (!window.isSecureContext && location.hostname !== "localhost") {
    alert("La camara requiere HTTPS o localhost.");
    return;
  }

  if (!window.ZXingWASM || typeof window.ZXingWASM.readBarcodes !== "function") {
    alert("No se pudo cargar zxing-wasm. Verifica conexion y recarga la pagina.");
    return;
  }

  try {
    if (typeof window.ZXingWASM.prepareZXingModule === "function") {
      updateScannerStatus("Inicializando motor de lectura...");
      await window.ZXingWASM.prepareZXingModule({
        overrides: {
          locateFile: (path, prefix) => {
            if (path.endsWith(".wasm")) {
              return "./vendor/zxing-wasm/zxing_reader.wasm";
            }
            return prefix + path;
          },
        },
        fireImmediately: true,
      });
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: { ideal: "environment" },
        width: { ideal: 1920 },
        height: { ideal: 1080 },
      },
      audio: false,
    });

    state.stream = stream;
    state.scannerOpen = true;
    state.scanAttempts = 0;

    if (!state.scanCanvas) {
      ensureScanCanvas(2, 2);
    }

    els.scannerVideo.srcObject = stream;
    await els.scannerVideo.play();

    els.scannerModal.classList.add("open");
    els.scannerModal.setAttribute("aria-hidden", "false");
    updateScannerStatus("Camara activa. Busca un codigo dentro del recuadro.");

    scanFrame();
  } catch (error) {
    const msg = error && error.message ? error.message : "No se pudo abrir la camara.";
    alert(msg);
    closeScanner();
  }
}

function wireEvents() {
  els.form.addEventListener("submit", onSubmitForm);
  els.productType.addEventListener("change", toggleCustomType);
  els.clearBtn.addEventListener("click", clearAllRecords);
  els.exportCsvBtn.addEventListener("click", downloadCsv);
  els.scanBtn.addEventListener("click", openScanner);
  els.closeScannerBtn.addEventListener("click", closeScanner);

  els.searchInput.addEventListener("input", (event) => {
    state.searchTerm = event.target.value;
    renderRecords();
  });

  els.scannerModal.addEventListener("click", (event) => {
    if (event.target === els.scannerModal) {
      closeScanner();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && state.scannerOpen) {
      closeScanner();
    }
  });

  els.goPortalBtn.addEventListener("click", () => {
    window.location.href = "../";
  });
}

function init() {
  loadRecords();
  wireEvents();
  renderAll();
}

init();
