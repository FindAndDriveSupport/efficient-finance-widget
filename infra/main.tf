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