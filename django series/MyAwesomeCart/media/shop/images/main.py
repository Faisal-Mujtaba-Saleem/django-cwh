import os


def main():

    images_names = [
        "iphone-14-pro.jpeg",
        "samsung-galaxy-s23-ultra.jpeg",
        "google-pixel-8-pro.jpeg",
        "oneplus-11.jpeg",
        "xiaomi-mi-13-pro.jpeg",
        "sony-xperia-1-iv.jpeg",
        "oppo-find-x6-pro.jpeg",
        "asus-rog-phone-7.jpeg",
        "dyson-v15-detect-cordless-vacuum-cleaner.jpeg",
        "roomba-i7-plus.jpeg",
        "shark-navigator-lift-away.jpeg",
        "eufy-robovac-11s.jpeg",
        "bissell-crosswave.jpeg",
        "dyson-ball-animal-2.jpeg",
        "miele-complete-c3.jpeg",
        "hoover-windtunnel-3.jpeg",
        "lg-55-inch-oled-tv.jpeg",
        "sony-65-inch-4k-ultra-hd.jpeg",
        "samsung-75-inch-qled.jpeg",
        "tcl-50-inch-roku-tv.jpeg",
        "vizio-70-inch-4k.jpeg",
        "philips-58-inch-4k.jpeg",
        "hisense-43-inch-4k.jpeg",
        "sharp-55-inch-4k.jpeg",
        "levis-501-original-fit-jeans.jpeg",
        "tommy-hilfiger-polo-shirt.jpeg",
        "ralph-lauren-chinos.jpeg",
        "hugo-boss-suit-jacket.jpeg",
        "burberry-trench-coat.jpeg",
        "calvin-klein-graphic-tshirt.jpeg",
        "dockers-signature-khakis.jpeg",
        "abercrombie-flannel-shirt.jpeg",
        "nike-air-max-270.jpeg",
        "adidas-ultraboost-22.jpeg",
        "puma-rs-x.jpeg",
        "converse-chuck-taylor-all-star.jpeg",
        "new-balance-990v5.jpeg",
        "reebok-classic-leather.jpeg",
        "vans-old-skool.jpeg",
        "skechers-go-walk.jpeg"
    ]

    cd = os.listdir()

    cd.sort(
        key=lambda x: os.path.getmtime(x)
    )

    for i, name in enumerate(images_names):
        os.rename(cd[i], name)


if __name__ == "__main__":
    main()
