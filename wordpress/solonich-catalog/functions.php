<?php
defined('ABSPATH') || exit;

// WordPress keeps managing installation and themes. Catalogue permissions stay in Supabase.
function solonich_catalog_render() {
    $directory = get_template_directory() . '/build';
    $path = (string) parse_url(isset($_SERVER['REQUEST_URI']) ? $_SERVER['REQUEST_URI'] : '/', PHP_URL_PATH);
    $route = trim($path, '/');

    // These old WordPress pages now belong to sections of the single landing page.
    $moved = array('contact' => '/#contacts', 'catalog' => '/#catalog', 'category/glavnaya' => '/');
    if (isset($moved[$route])) {
        wp_safe_redirect(home_url($moved[$route]), 301);
        exit;
    }

    if ($route === 'robots.txt' || $route === 'sitemap.xml') {
        status_header(200);
        header('Content-Type: ' . ($route === 'robots.txt' ? 'text/plain' : 'application/xml') . '; charset=UTF-8');
        readfile($directory . '/' . $route);
        exit;
    }
    if ($route === 'wp-sitemap.xml') {
        wp_safe_redirect(home_url('/sitemap.xml'), 301);
        exit;
    }

    $known = $route === '' || in_array($route, array('profile', 'admin', 'admin/new', 'setup'), true)
        || preg_match('~^product/[1-9][0-9]{0,11}$~D', $route);
    $file = $directory . '/index.html';
    // Only a restricted route, never a user-supplied file path, can select a prerendered page.
    if ($known && $route !== '') {
        $candidate = $directory . '/' . $route . '/index.html';
        if (is_file($candidate)) $file = $candidate;
    }
    if (!is_file($file)) {
        status_header(503);
        header('Content-Type: text/plain; charset=UTF-8');
        echo 'The catalogue is temporarily unavailable.';
        exit;
    }

    status_header($known ? 200 : 404);
    header('Content-Type: text/html; charset=UTF-8');
    header("Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' https: data:; font-src 'self' data:; connect-src 'self' https://xukraqoitjpgddhrgmqe.supabase.co; frame-src https://www.google.com; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; upgrade-insecure-requests");
    header('X-Frame-Options: DENY');
    header('X-Content-Type-Options: nosniff');
    header('Referrer-Policy: strict-origin-when-cross-origin');
    header('Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()');
    if (!$known || preg_match('~^(admin|profile|setup)(/|$)~', $route)) {
        nocache_headers();
        header('Cache-Control: no-store');
        header('X-Robots-Tag: noindex, nofollow');
    }
    readfile($file);
    exit;
}

add_action('template_redirect', function () {
    if (is_admin() || wp_doing_ajax() || (defined('REST_REQUEST') && REST_REQUEST)) return;
    solonich_catalog_render();
}, -100);
