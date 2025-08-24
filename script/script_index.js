let title = document.getElementById("title_container");
let text = title.textContent.trim();
let colors = ["rgba(204, 46, 46, 1)", "rgba(47, 184, 47, 1)", "rgba(58, 67, 194, 1);", "rgba(224, 164, 53, 1)"];

let newHTML = "";
for(let i = 0; i < colors.length; i++) {
    newHTML += `<span style="color:${colors[i]}; text-shadow: 1.5px 1.5px 10px ${colors[i]}">${text[i]}</span>`;
}
title.innerHTML = newHTML;