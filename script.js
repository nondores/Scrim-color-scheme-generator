const form = document.getElementById('controls');
const colorPicker = document.getElementById('color-picker');
const modeSelect = document.getElementById('color-box');
const colorContainer = document.getElementById('color-scheme');
const toast = document.getElementById('toast');

form.addEventListener("submit", (e) => {
    e.preventDefault();
    getColorScheme();
})

// function helper to fetch the color scheme from the API

async function getColorScheme() {
    const hex = colorPicker.value.replace("#", "");
    const mode = modeSelect.value;

    if(!hex || !mode) {
        renderError();
        return;
    }

    colorContainer.innerHTML = `
        <div
            class="color"
            style = "background:#1e293b; width:100%"
        >
            Loading color scheme...
        </div>
    `;

    try {
        const res = await fetch(
            `https://www.thecolorapi.com/scheme?hex=${hex}&mode=${mode}&count=5`
        )

        if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        renderColors(data.colors);

    } catch (error) {
        console.error("Error fetching color scheme:", error);
        renderError();
    }
}

const getTextColor = (r, g, b) => {
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? "#000000" : "#ffffff";
}

const renderColors = (colors) => {
    const html = colors.map(color => {

        const { r, g, b } = color.rgb;

        const textColor = getTextColor(r, g, b);

        return `
            <div
                class = "color"
                style = "background: ${color.hex.value}; color: ${textColor}"
            >
                <span>${color.hex.value}</span>
            </div>
        `
    }).join("");

    colorContainer.innerHTML = html;
}

const showToast = () => {
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}

const renderError = () => {
    colorContainer.innerHTML = `
    <div
        class="color" 
        style="background:#111;
        width:100%"
    >
        Error fetching color scheme. Please try again.
    </div>
    `;
}

// copy hex value

colorContainer.addEventListener("click", (e) => {

    const colorEl = e.target.closest(".color");

    if (!colorEl) return;

    const hexValue = colorEl.textContent.trim();
    navigator.clipboard.writeText(hexValue);

    showToast();

})

// Load the page

getColorScheme();

