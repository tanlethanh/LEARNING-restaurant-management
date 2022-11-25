export function createYesNoModal(title, yesCallback,
    yesContent = "Chấp nhận", noContent = "Quay lại"
) {
    const modalBackground = document.createElement('div')
    const body = document.getElementsByTagName("body")[0]
    body.appendChild(modalBackground)
    modalBackground.classList.add("modal-background")

    // Modal box
    const modalBox = document.createElement('div')
    modalBackground.appendChild(modalBox)
    modalBox.classList.add("modal-box")

    // Title
    const modalTitle = document.createElement('h3')
    modalBox.appendChild(modalTitle)
    modalTitle.classList.add("modal-title")
    modalTitle.innerHTML = title

    // Button container
    const buttonBox = document.createElement("div")
    modalBox.appendChild(buttonBox)
    buttonBox.classList.add("modal-button")

    // Yes button
    const yesButton = document.createElement('button')
    buttonBox.appendChild(yesButton)
    yesButton.classList.add("modal-yes-button")
    yesButton.innerHTML = yesContent
    yesButton.addEventListener('click', async (event) => {
        const loading = document.getElementById("loading")
        if (loading.classList.contains("hidden")) {
            loading.classList.remove("hidden")
        }
        await yesCallback(event)
        loading.classList.add("hidden")
        modalBackground.remove()
    })

    // No button
    const noButton = document.createElement('button')
    buttonBox.appendChild(noButton)
    noButton.classList.add("modal-no-button")
    noButton.innerHTML = noContent
    noButton.addEventListener('click', () => {
        modalBackground.remove()
    })
}
