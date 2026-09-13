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

resource "cloudflare_ruleset" "block_php_scanners" {
  zone_id = var.cloudflare_zone_id
  name    = "Block PHP scanner probes"
  phase   = "http_request_firewall_custom"

  rules {
    action      = "block"
    expression  = "(ends_with(http.request.uri.path, \".php\"))"
    description = "Block requests for .php paths — stack has no PHP anywhere, so these are always scanners"
  }
}