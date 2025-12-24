// import { defineNuxtPlugin } from '#app'


// export default defineNuxtPlugin(() => {
//   // Ensure this plugin runs only on the client.
//   if (process.client) {
//     import('monaco-editor').then((monaco) => {
//       // Extend YAML tokenization for specific keys.
//       monaco.languages.setMonarchTokensProvider('yaml', {
//         tokenizer: {
//           root: [
//             // Matches keys "rule", "description", "conditions", "field", "required" when followed by a colon.
//             [/\b(rule|description|conditions|field|required)\b(?=\s*:)/, 'specialKey.yaml'],
//             // Generic keys.
//             [/[a-zA-Z0-9_-]+(?=\s*:)/, 'key.yaml'],
//             // Strings enclosed in double quotes.
//             [/"[^"]*"/, 'string'],
//             // Numbers.
//             [/\d+/, 'number'],
//             // Booleans.
//             [/\b(true|false)\b/, 'keyword'],
//             // Any other text.
//             [/.+/, 'text']
//           ],
//           whitespace: [
//             [/[ \t\r\n]+/, 'white']
//           ]
//         }
//       });

//       // Define a custom theme that applies colors only to keys.
//       monaco.editor.defineTheme('custom-yaml', {
//         base: 'vs-dark',
//         inherit: true,
//         rules: [
//           // Use purple for the special keys.
//           { token: 'specialKey.yaml', foreground: 'FF00FF' },
//           // Optionally, use green for other keys.
//           { token: 'key.yaml', foreground: '00FF00' }
//         ]
//       });
//     });
//   }
// });
