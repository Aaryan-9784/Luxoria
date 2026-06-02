import urllib.request, json
req = urllib.request.Request("https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=Rolls-Royce_Phantom_VIII&format=json&pithumbsize=1000", headers={"User-Agent": "Mozilla/5.0"})
data = json.loads(urllib.request.urlopen(req).read().decode("utf-8"))
pages = data["query"]["pages"]
urls = [pages[p]["thumbnail"]["source"] for p in pages if "thumbnail" in pages[p]]
with open("rolls_url.txt", "w") as f:
    f.write(urls[0])
