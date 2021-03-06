import { browser } from "webextension-polyfill-ts";
import { getApiKeys, getSearcherStates } from "./utility";
import * as Mustache from "mustache";
import { ApiKeys } from "./lib/types";

export async function saveApiKeys(): Promise<void> {
  const urlscanApiKey = document.getElementById(
    "urlscan-api-key"
  ) as HTMLInputElement;
  const virusTotalApiKey = document.getElementById(
    "virustotal-api-key"
  ) as HTMLInputElement;
  const apiKeys: ApiKeys = {
    urlscanApiKey: urlscanApiKey.value,
    virusTotalApiKey: virusTotalApiKey.value,
  };
  if (apiKeys) {
    await browser.storage.sync.set({ apiKeys });
    const status = document.getElementById("status");
    if (status) {
      status.textContent = "Options saved.";
    }
  }
}

export function saveSearcherStates(): void {
  const searcherStates = {};
  const searcherList = document.getElementById("searcherList") as HTMLElement;
  const radios = searcherList.querySelectorAll<HTMLInputElement>(
    '[type="checkbox"]'
  );
  for (const radio of radios) {
    const name = radio.getAttribute("name");
    if (name === null) {
      continue;
    }
    searcherStates[name] = radio.checked;
  }
  browser.storage.sync.set({ searcherStates });
}

// Saves options to chrome.storage.sync.
export function saveOptions(): void {
  saveApiKeys();
  saveSearcherStates();
}

export async function restoreApiKeys(): Promise<void> {
  const urlscanApiKey = document.getElementById(
    "urlscan-api-key"
  ) as HTMLInputElement;
  const virusTotalApiKey = document.getElementById(
    "virustotal-api-key"
  ) as HTMLInputElement;

  const apiKeys = await getApiKeys();

  if (apiKeys.urlscanApiKey) {
    urlscanApiKey.value = apiKeys.urlscanApiKey;
  }
  if (apiKeys.virusTotalApiKey) {
    virusTotalApiKey.value = apiKeys.virusTotalApiKey;
  }
}

export async function restoreSearcherStates(): Promise<void> {
  const states = await getSearcherStates();

  const searcherList = document.getElementById("searcherList") as HTMLElement;
  const fragment: DocumentFragment = document.createDocumentFragment();
  const template = (document.getElementById("checkTemplate") as HTMLElement)
    .innerHTML;

  for (const state of states) {
    const elem = document.createElement("div");
    elem.innerHTML = Mustache.render(template, state);
    fragment.appendChild(elem);
  }
  searcherList.appendChild(fragment);
}

export function restoreOptions(): void {
  restoreApiKeys();
  restoreSearcherStates();
}

if (typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    restoreOptions();
    const save = document.getElementById("save");
    if (save) {
      save.addEventListener("click", saveOptions);
    }
  });
}
