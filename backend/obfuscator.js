import crypto from "crypto";

function randomName() {
  return "_" + crypto.randomBytes(4).toString("hex");
}

function encryptString(str) {
  const key = Math.floor(Math.random() * 255);
  const enc = [...str].map(c => c.charCodeAt(0) ^ key);
  return `((function() local t={${enc.join(",")}} local s="" for i=1,#t do s=s..string.char(bit32.bxor(t[i],${key})) end return s end)())`;
}

export function obfuscate(lua) {
  let vars = {};
  lua = lua.replace(/\blocal\s+([a-zA-Z_]\w*)/g, (_, v) => {
    vars[v] = randomName();
    return "local " + vars[v];
  });

  for (let v in vars) {
    lua = lua.replace(new RegExp("\\b" + v + "\\b", "g"), vars[v]);
  }

  lua = lua.replace(/"([^"]*)"/g, (_, s) => encryptString(s));

  const header = `
--[[ RFWLUA OBFUSCATED
 Anti-Tamper Enabled
 ]]--
if debug and debug.getinfo then return end
`;

  return header + "\n" + lua;
}
