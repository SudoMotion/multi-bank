<?php

namespace App\Banking;

use RuntimeException;

/**
 * A business rule rejected a ledger operation. The message is safe to show.
 */
class LedgerException extends RuntimeException {}
