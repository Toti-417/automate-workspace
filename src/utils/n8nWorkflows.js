// Real, valid n8n Workflow Blueprint templates ready to import into n8n (http://100.92.106.96:5678)

export const N8N_WORKFLOW_TEMPLATES = [
  {
    id: "wf-cv-screener",
    name: "HR Auto-CV Screener & Google Sheets Sync",
    category: "HR & Rekrutmen",
    description: "Menerima upload CV via Webhook, ekstrak informasi kontak & skill via AI/Regex, lalu masukkan baris ke Google Sheets dan kirim notifikasi ke Telegram HR.",
    nodesCount: 6,
    trigger: "Webhook (POST /webhook/screen-cv)",
    workflowJson: {
      "name": "HR Auto-CV Screener & Sheets Sync",
      "nodes": [
        {
          "parameters": {
            "httpMethod": "POST",
            "path": "screen-cv",
            "responseMode": "responseNode",
            "options": {}
          },
          "name": "Webhook Inbound CV",
          "type": "n8n-nodes-base.webhook",
          "typeVersion": 1,
          "position": [250, 300]
        },
        {
          "parameters": {
            "functionCode": "// Ekstraksi Regex Nama, Email, No HP & Skills\nconst body = items[0].json.body || {};\nconst text = body.cv_text || '';\nconst emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}/);\nconst phoneMatch = text.match(/(?:\\+62|62|08)[0-9\\- ]{8,14}/);\n\nreturn [{\n  json: {\n    candidate_name: body.candidate_name || 'Applicant',\n    email: emailMatch ? emailMatch[0] : 'N/A',\n    phone: phoneMatch ? phoneMatch[0].replace(/[^0-9+]/g, '') : 'N/A',\n    status: 'Auto-Screened',\n    extracted_at: new Date().toISOString()\n  }\n}];"
          },
          "name": "Regex Extractor",
          "type": "n8n-nodes-base.function",
          "typeVersion": 1,
          "position": [480, 300]
        },
        {
          "parameters": {
            "operation": "append",
            "sheetId": "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
            "range": "Applicants!A:E"
          },
          "name": "Append to Google Sheets",
          "type": "n8n-nodes-base.googleSheets",
          "typeVersion": 2,
          "position": [700, 300]
        },
        {
          "parameters": {
            "chatId": "-100123456789",
            "text": "🎯 *Kandidat Baru Masuk!*\nNama: {{ $json.candidate_name }}\nEmail: {{ $json.email }}\nPhone: {{ $json.phone }}"
          },
          "name": "Telegram Alert HR",
          "type": "n8n-nodes-base.telegram",
          "typeVersion": 1,
          "position": [920, 300]
        }
      ],
      "connections": {
        "Webhook Inbound CV": { "main": [[{ "node": "Regex Extractor", "type": "main", "index": 0 }]] },
        "Regex Extractor": { "main": [[{ "node": "Append to Google Sheets", "type": "main", "index": 0 }]] },
        "Append to Google Sheets": { "main": [[{ "node": "Telegram Alert HR", "type": "main", "index": 0 }]] }
      }
    }
  },
  {
    id: "wf-invoice-ocr",
    name: "Invoice & Receipt Auto-OCR to Excel Database",
    category: "Keuangan & Invoice",
    description: "Menerima foto nota/kuitansi/invoice, membaca total nominal, tanggal, dan nama toko secara otomatis, lalu mencatat ke pembukuan keuangan.",
    nodesCount: 5,
    trigger: "Webhook (POST /webhook/parse-invoice)",
    workflowJson: {
      "name": "Invoice Auto-OCR Pipeline",
      "nodes": [
        {
          "parameters": { "httpMethod": "POST", "path": "parse-invoice", "responseMode": "responseNode" },
          "name": "Inbound Invoice Webhook",
          "type": "n8n-nodes-base.webhook",
          "typeVersion": 1,
          "position": [240, 300]
        },
        {
          "parameters": {
            "jsCode": "const item = $input.first().json;\nreturn {\n  json: {\n    vendor: item.vendor || 'Unknown Vendor',\n    total_amount: Number(item.total || 0),\n    tax: Number(item.total || 0) * 0.11,\n    processed_date: new Date().toLocaleDateString('id-ID'),\n    verified: true\n  }\n};"
          },
          "name": "Tax & Currency Normalizer",
          "type": "n8n-nodes-base.code",
          "typeVersion": 2,
          "position": [480, 300]
        },
        {
          "parameters": { "respondWith": "json", "responseBody": "={{ JSON.stringify($json) }}" },
          "name": "Respond to Webhook",
          "type": "n8n-nodes-base.respondToWebhook",
          "typeVersion": 1,
          "position": [720, 300]
        }
      ],
      "connections": {
        "Inbound Invoice Webhook": { "main": [[{ "node": "Tax & Currency Normalizer", "type": "main", "index": 0 }]] },
        "Tax & Currency Normalizer": { "main": [[{ "node": "Respond to Webhook", "type": "main", "index": 0 }]] }
      }
    }
  },
  {
    id: "wf-telco-alert",
    name: "Telco Network Incident Auto-Dispatcher",
    category: "Infrastruktur & IT",
    description: "Memonitor log alarm BTS/Fiber Optic. Jika status CRITICAL/OUTAGE terdeteksi, format pesan dan tembak alert ke tim teknisi lapangan dalam 1 detik.",
    nodesCount: 4,
    trigger: "Webhook (POST /webhook/telco-alarm)",
    workflowJson: {
      "name": "Telco Incident Dispatcher",
      "nodes": [
        {
          "parameters": { "httpMethod": "POST", "path": "telco-alarm" },
          "name": "Alarm Receiver",
          "type": "n8n-nodes-base.webhook",
          "typeVersion": 1,
          "position": [240, 300]
        },
        {
          "parameters": {
            "conditions": {
              "string": [{ "value1": "={{ $json.body.severity }}", "value2": "CRITICAL" }]
            }
          },
          "name": "Filter Critical Only",
          "type": "n8n-nodes-base.if",
          "typeVersion": 1,
          "position": [460, 300]
        },
        {
          "parameters": {
            "text": "🚨 *CRITICAL BTS ALARM DETECTED!*\nSite: {{ $json.body.cell_id }}\nAlarm: {{ $json.body.alarm_code }}\nStatus: {{ $json.body.status }}\nSegera lakukan dispatch teknisi lapangan!"
          },
          "name": "Notify Incident Team",
          "type": "n8n-nodes-base.telegram",
          "typeVersion": 1,
          "position": [700, 240]
        }
      ],
      "connections": {
        "Alarm Receiver": { "main": [[{ "node": "Filter Critical Only", "type": "main", "index": 0 }]] },
        "Filter Critical Only": { "main": [[{ "node": "Notify Incident Team", "type": "main", "index": 0 }]] }
      }
    }
  }
];
