import AppManager from "./AppManager";

export class Logcat {

    static Debug(message: any | null): void { if (AppManager.isDeveloping) console.log(message); }
    static Error(message: any | null): void { if (AppManager.isDeveloping) console.error(message); }
    static Info(message: any | null): void { if (AppManager.isDeveloping) console.info(message); }

}
