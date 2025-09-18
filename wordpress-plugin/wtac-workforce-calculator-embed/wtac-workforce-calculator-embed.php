
<?php
/*
Plugin Name: WTAC Workforce Calculator Embed
Description: Embed the WTAC Calculator app inside WordPress using a shortcode.
Version: 0.1.0
Author: WTAC
*/

if (!defined('ABSPATH')) exit;

function wtac_calculator_shortcode($atts){
  $atts = shortcode_atts(array(
    'url' => 'https://your-app-url.vercel.app',
    'height' => '900'
  ), $atts, 'wtac_calculator');
  $url = esc_url($atts['url']);
  $height = intval($atts['height']);
  ob_start(); ?>
  <div class="wtac-calculator-embed" style="width:100%;">
    <iframe src="<?php echo $url; ?>" style="width:100%; height:<?php echo $height; ?>px; border:0;" allow="clipboard-write; fullscreen"></iframe>
  </div>
  <?php
  return ob_get_clean();
}
add_shortcode('wtac_calculator', 'wtac_calculator_shortcode');
