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

resource "cloudflare_ruleset" "dealer_widget_rate_limit" {
  zone_id = var.cloudflare_zone_id
  name    = "Dealer widget bot rate limit"
  kind    = "zone"
  phase   = "http_ratelimit"

  rules {
    action     = "managed_challenge"
    expression = "(http.request.method eq \"POST\" and http.request.uri.path in {\"/\" \"/en\"})"

    ratelimit {
      characteristics     = ["ip.src", "cf.colo.id"]
      period              = 30
      requests_per_period = 15
      mitigation_timeout  = 600
    }

    description = "Managed-challenge bots hammering Server Action endpoints across all dealer frontend Workers"
  }
}

resource "cloudflare_ruleset" "block_scanner_paths" {
  zone_id = var.cloudflare_zone_id
  name    = "Block common scanner probes"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(ends_with(http.request.uri.path, \".php\") or http.request.uri.path contains \"/wp-\" or http.request.uri.path contains \"/.env\" or http.request.uri.path contains \"/.git\" or http.request.uri.path contains \"/xmlrpc\" or http.request.uri.path contains \"/phpmyadmin\" or http.request.uri.path contains \"/getInitData\" or http.request.uri.path contains \"/graphql\" or http.request.uri.path contains \"/api/gql\" or http.request.uri.path contains \"/v2/_catalog\")"
    description = "Block requests for PHP/WordPress/git/env/GraphQL/registry paths and known probed non-existent endpoints - stack has none of these, so they're always scanners"
  }
}

resource "cloudflare_zone_settings_override" "bot_protection" {
  zone_id = var.cloudflare_zone_id

  settings {
    security_level = "medium"
  }
}

resource "cloudflare_ruleset" "waf_managed" {
  zone_id = var.cloudflare_zone_id
  name    = "Cloudflare Managed WAF"
  kind    = "zone"
  phase   = "http_request_firewall_managed"

  rules {
    action = "execute"
    action_parameters {
      id = "efb7b8c949ac4650a09736fc376e9aee"
    }
    expression  = "true"
    description = "Run Cloudflare managed ruleset against all traffic"
  }
}
