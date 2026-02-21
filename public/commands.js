/* global Office */

// FlowGuard - On-Send Handler (Smart Alerts)
// This file runs inside the Outlook host when a user clicks "Send"

var ATTACHMENT_KEYWORDS = [
  "attached",
  "please find attached",
  "see attached",
  "attachment",
  "enclosed",
  "find enclosed",
  "attaching",
  "i have attached",
  "i've attached",
  "file attached",
  "document attached"
];

var QUOTE_KEYWORDS = [
  "quote", "quotation", "price", "pricing", "offer",
  "rfq", "rfp", "bom", "proposal", "bid", "estimate"
];

var CURRENCY_PATTERNS = [
  /\$[\d,.]+/,
  /[\d,.]+\s?USD/i,
  /[\d,.]+\s?ILS/i,
  /[\d,.]+\s?EUR/i,
  /[\d,.]+\s?GBP/i,
  /\u20AA[\d,.]+/,
  /\u20AC[\d,.]+/,
  /\u00A3[\d,.]+/
];

function containsKeyword(text, keywords) {
  var lower = text.toLowerCase();
  for (var i = 0; i < keywords.length; i++) {
    if (lower.indexOf(keywords[i]) !== -1) {
      return true;
    }
  }
  return false;
}

function containsCurrency(text) {
  for (var i = 0; i < CURRENCY_PATTERNS.length; i++) {
    if (CURRENCY_PATTERNS[i].test(text)) {
      return true;
    }
  }
  return false;
}

function onMessageSendHandler(event) {
  var item = Office.context.mailbox.item;
  var issues = [];

  // Get body text
  item.body.getAsync("text", function(bodyResult) {
    if (bodyResult.status !== Office.AsyncResultStatus.Succeeded) {
      // If we can't read the body, allow send
      event.completed({ allowEvent: true });
      return;
    }

    var bodyText = bodyResult.value || "";

    // Check 1: Attachment keyword mentioned but no attachments
    var mentionsAttachment = containsKeyword(bodyText, ATTACHMENT_KEYWORDS);
    var attachmentCount = item.attachments ? item.attachments.length : 0;

    if (mentionsAttachment && attachmentCount === 0) {
      issues.push("Your email mentions an attachment, but no file is attached.");
    }

    // Check 2: Quote-related reply without pricing
    item.subject.getAsync(function(subjectResult) {
      var subject = "";
      if (subjectResult.status === Office.AsyncResultStatus.Succeeded) {
        subject = subjectResult.value || "";
      }

      var combined = bodyText + " " + subject;
      var isQuoteRelated = containsKeyword(combined, QUOTE_KEYWORDS);

      if (isQuoteRelated && !containsCurrency(bodyText)) {
        issues.push("This appears to be a quote reply, but no pricing was detected in your email.");
      }

      // Determine result
      if (issues.length > 0) {
        var message = "FlowGuard Pre-Send Check:\n\n" + issues.join("\n\n") +
          "\n\nClick 'Don't Send' to go back and edit, or 'Send Anyway' to proceed.";

        event.completed({
          allowEvent: false,
          cancelReason: message
        });
      } else {
        event.completed({ allowEvent: true });
      }
    });
  });
}

// Register the handler with Office
Office.actions.associate("onMessageSendHandler", onMessageSendHandler);
