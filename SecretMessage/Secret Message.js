//decoding
const {hash} = window.location;
const msg = atob(hash.replace(`#`, ``));
if(msg) {
    document.querySelector(`#msg-show`).classList.remove(`hide`);
    document.querySelector(`#msg-form`).classList.add(`hide`);
    document.querySelector(`h1`).innerText = msg;
}

document.querySelector(`form`).addEventListener(`submit`, event => {
    event.preventDefault();

    //hiding and showing results
    const msgForm = document.querySelector(`#msg-form`);
    const linkForm = document.querySelector(`#link-form`);
    msgForm.classList.add(`hide`);
    linkForm.classList.remove(`hide`);

    //encoding to base64
    const input = document.querySelector(`#msg-input`);
    const encrypted = btoa(input.value);
    const link = document.querySelector(`#link-input`);
    link.value = `${window.location}#${encrypted}`;
    link.select();
});