const ui = require("ui-lib/library");

const min = 0.125, max = 16;
var speed = 1;
var folded = true;
var wrapper, button, ut, ft;

// Turn speed into slider value
const log2 = n => Math.log(n) / Math.log(2);

Time.deltaProvider = () => Math.min(Core.graphics.deltaTime * 60 * speed, 3 * speed);

function addButton(table) {
	if (button) {
		table.add(button);
		return;
	}

	button = table.button(Icon.leftOpen, 48, () => {
		folded = !folded;
		button.style.imageUp = folded ? Icon.leftOpen : Icon.rightOpen;

		wrapper.clear();
		addButton(wrapper);
		wrapper.add(folded ? ft : ut);
	}).get();
}

function addTable(table) {
	table.table(cons(t => {
		t.label(() => speed + "x").get().alignment = Align.center;
		t.row();
		t.slider(log2(min), log2(max), 1, 1, n => {speed = Math.pow(2, n)}).growX();
	})).padLeft(10);
}

ui.addTable("bottom", "ZZZ_time-control", t => {
	ut = new Table().bottom().left();
	addTable(ut);
	ft = new Table().bottom().left();
	addButton(ft);

	wrapper = t.bottom().left();
	addButton(t);
	wrapper.background(Tex.buttonEdge3);
	wrapper.add(ft);
});
