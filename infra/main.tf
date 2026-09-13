terraform {
  required_providers {
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
  }
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

# --- Rate limit: bot spam on Next.js Server Action endpoints ---
resource "cloudflare_ruleset" "dealer_widget_rate_limit" {
  zone_id = var.cloudflare_zone_id
  name    = "Dealer widget bot rate limit"
  phase   = "http_ratelimit"

  rules {
    action     = "managed_challenge"
    expression = "(http.request.method eq \"POST\" and http.request.uri.path in {\"/\" \"/en\"} and any(http.request.headers[\"next-action\"][*] ne \"\"))"

    ratelimit {
      characteristics     = ["ip.src"]
      period              = 30
      requests_per_period = 15
      mitigation_timeout  = 600
    }

    description = "Managed-challenge bots hammering Server Action endpoints across all dealer frontend Workers"
  }
}

# --- Block known scanner path signatures ---
resource "cloudflare_ruleset" "block_scanner_paths" {
  zone_id = var.cloudflare_zone_id
  name    = "Block common scanner probes"
  phase   = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(ends_with(http.request.uri.path, \".php\") or http.request.uri.path contains \"/wp-\" or http.request.uri.path contains \"/.env\" or http.request.uri.path contains \"/.git\" or http.request.uri.path contains \"/xmlrpc\" or http.request.uri.path contains \"/phpmyadmin\" or http.request.uri.path contains \"/getInitData\")"
    description = "Block requests for PHP/WordPress/git/env paths and known probed non-existent endpoints — stack has none of these, so they're always scanners"
  }
}

# --- Zone-wide bot heuristics ---
resource "cloudflare_zone_settings_override" "bot_protection" {
  zone_id = var.cloudflare_zone_id

  settings {
    security_level = "medium"
  }
}

resource "cloudflare_bot_management" "this" {
  zone_id            = var.cloudflare_zone_id
  fight_mode         = true
  enable_js          = true
  using_latest_model = true
}

# --- Cloudflare-managed WAF ruleset (SQLi, RCE, path traversal, etc.) ---
resource "cloudflare_ruleset" "waf_managed" {
  zone_id = var.cloudflare_zone_id
  name    = "Cloudflare Managed WAF"
  phase   = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee" # Cloudflare Managed Ruleset
    }
    expression  = "true"
    description = "Run Cloudflare's managed ruleset against all traffic"
  }
}