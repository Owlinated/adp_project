export class NumberStatus {
    public active: boolean;
    public decimaldot: boolean;
    public zerostarted: boolean;
    public value: string;

    constructor() {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    public Update(
        active: boolean | null,
        decimaldot: boolean | null,
        zerostarted: boolean | null,
        value: string | null) {
        if (active != null) { this.active = active; }
        if (decimaldot != null) { this.decimaldot = decimaldot; }
        if (zerostarted != null) { this.zerostarted = zerostarted; }
        if (value != null) { this.value += value; }
    }

    public Copycat(obj: NumberStatus) {
        this.Update(obj.active, obj.decimaldot, obj.zerostarted, obj.value);
    }

    public Reset() {
        this.active = this.decimaldot = this.zerostarted = false;
        this.value = "";
    }

    public Clone() {
        const result = new NumberStatus();
        result.Copycat(this);
        return result;
    }
}
