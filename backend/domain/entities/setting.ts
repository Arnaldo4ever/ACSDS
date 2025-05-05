export class Setting {
  name: string;
  description: string;
  type: string;
  value: string;

  constructor(name: string, description: string, type: string, value: string) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.value = value;
  }
}

export interface SettingsFile {
  settings: Setting[];
}