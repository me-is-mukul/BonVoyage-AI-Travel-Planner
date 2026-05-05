import zipfile, json, os, shutil

src = os.path.join(os.path.dirname(__file__), "best_daynight_model.keras")
tmp = src + ".tmp"

DEAD_KEYS = {"renorm", "renorm_clipping", "renorm_momentum"}

def strip(obj):
    if isinstance(obj, dict):
        for k in DEAD_KEYS:
            obj.pop(k, None)
        for v in obj.values():
            strip(v)
    elif isinstance(obj, list):
        for item in obj:
            strip(item)

with zipfile.ZipFile(src, "r") as zin, zipfile.ZipFile(tmp, "w", zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        data = zin.read(item.filename)
        if item.filename.endswith(".json"):
            try:
                cfg = json.loads(data.decode("utf-8"))
                strip(cfg)
                data = json.dumps(cfg, separators=(",", ":")).encode("utf-8")
            except Exception:
                pass
        zout.writestr(item, data)

os.replace(tmp, src)
print("Patched:", src)
