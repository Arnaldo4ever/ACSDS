import { Setting } from "../../domain/entities/setting.js";

export abstract class SettingsDatasource {
  abstract getSettingsData(): Promise<Setting[] | undefined>;
  abstract modifySetting(name: string, value: string): Promise<boolean>;
  abstract getSetting(name: string): Promise<Setting | undefined>;
  abstract insertSetting(setting: Setting): Promise<boolean>;
  abstract  deleteSetting(setting: Setting): Promise<boolean>;
  abstract syncSettings(): Promise<boolean>
}