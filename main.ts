import { Plugin } from "obsidian"

export default class ImgCaption extends Plugin {
	observer: MutationObserver

	onload() {
		// Register the initial processor
		this.registerMarkdownPostProcessor((el) => {
			this.processImages(el)
		})

		// Set up mutation observer to catch dynamically loaded images
		this.observer = new MutationObserver((mutations: MutationRecord[]) => {
			mutations.forEach((rec: MutationRecord) => {
				if (rec.type === "childList") {
					this.processImages(rec.target as Element)
				}
			})
		})

		// Start observing
		this.observer.observe(document.body, {
			subtree: true,
			childList: true,
		})
	}

	processImages(el: Element) {
		el.querySelectorAll(".image-embed").forEach((el) => {
			const altText = el.getAttribute("alt")
			if (altText) {
				el.setAttribute("data-label", altText.replace(/^.*[\\/]/, "").replace(/\.[^/.]+$/, ""))
			}
		})
	}

	onunload() {
		this.observer.disconnect()
	}
}
