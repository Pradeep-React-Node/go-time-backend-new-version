const Stripe = require("stripe");
const userSchema = require("../models/user");
const walletSchema = require("../models/userWallet");
const SECRET_KEY =
  "sk_test_51JUK6KANI3PJms4uigyfZKK1NebG6bYnZDCI2J19VniR2yhaeyVTbRFfkvHPTaBgtFSzwF7Ksa9KE7OoR6QNQa1s00cm2eCvnl";
const stripe = Stripe(SECRET_KEY, { apiVersion: "2020-08-27" });

module.exports = {
  makeCardPayment: async (req, res) => {
    try {
      var { amount, usedWalletAmount, wallet_id } = req?.body;
      var amountToPay = amount - usedWalletAmount;
      var existingWallet = await walletSchema?.findOne(
        { _id: wallet_id },
        "amount"
      );
      console.log(existingWallet, "wall");
      var updatedWallet = await walletSchema?.findOneAndUpdate(
        { _id: wallet_id },
        {
          amount: (
            parseInt(existingWallet?.amount) - usedWalletAmount
          )?.toString(),
        },
        { new: true }
      );
      console.log(updatedWallet, "wallUpdated");
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountToPay * 100,
        currency: "usd",
        payment_method_types: ["card"],
        description: "Payment for everything",
      });

      const clientSecret = paymentIntent.client_secret;

      res.status(200)?.send({
        clientSecret: clientSecret,
      });
    } catch (e) {
      res.status(200)?.send({ error: e.message });
    }
  },

  subscribeCustomer: async (req, res) => {
    try {
      var customer;
      var existingSubscription;
      var { email, token, user_id, plan_id, subscription_id } = req?.body;
      console.log(plan_id, "mahPlan");
      var userData = await userSchema?.findOne({ _id: user_id });
      if (userData?.customer_id) {
        var existingCustomer = await stripe.customers.retrieve(
          userData?.customer_id
        );
      }
      if (plan_id === "1" && subscription_id) {
        await stripe.subscriptions.del(subscription_id);
        var newUpdatedUser = await userSchema?.findOneAndUpdate(
          { _id: user_id },
          { plan_id: "1", subscription_id: "" },
          { new: true }
        );
        res?.status(200)?.send({
          status: "success",
          updatedUser: newUpdatedUser,
        });
        return;
      }

      if (!existingCustomer?.id) {
        customer = await stripe.customers.create({
          email,
          source: token,
        });

        var updatedUser = await userSchema?.findOneAndUpdate(
          { _id: user_id },
          { customer_id: customer?.id },
          { new: true }
        );
      }

      if (!plan_id === "1") {
        var existingPlan = await stripe.prices.retrieve(userData?.plan_id);
        if (existingPlan?.id) {
          existingSubscription = await stripe.subscriptions.retrieve(
            userData?.plan_id
          );
          if (
            existingPlan?.product ===
            existingSubscription?.items?.data[0]?.price?.product
          ) {
            await stripe.subscriptions.del(existingSubscription?.id);
          }
        }
      }

      const subscription = await stripe.subscriptions.create({
        customer: customer ? customer?.id : existingCustomer?.id,
        items: [{ price: plan_id }],
        expand: ["latest_invoice.payment_intent"],
      });

      var updatedUserPlan = await userSchema?.findOneAndUpdate(
        { _id: user_id },
        { plan_id, subscription_id: subscription?.id },
        { new: true }
      );

      res?.status(200)?.send({
        status: "success",
        updatedUser: updatedUserPlan,
        subscription,
      });
    } catch (err) {
      res?.status(200)?.send({ status: "failed", message: err?.message });
    }
  },

  withdrawAmount: async (req, res) => {
    try {
      var {
        accountNumber,
        firstName,
        lastName,
        email,
        routingNumber,
        user_id,
        profileUrl,
        amount,
      } = req?.body;

      var walletData = await walletSchema?.findOne({ user_id });
      if (parseInt(walletData?.amount) < parseInt(amount)) {
        res?.status(200)?.send({
          status: "failed",
          message: "You don't have enough amount in wallet",
        });
        return;
      }

      let account;
      let bank_account;

      var userData = await userSchema?.findOne({ _id: user_id });
      let newUserData = userData;
      if (!userData?.stripe_account_id) {
        account = await stripe.accounts.create({
          type: "custom",
          country: "US",
          email,
          requested_capabilities: ["transfers"],
          business_profile: { url: profileUrl },
          business_type: "individual",
          individual: { first_name: firstName, last_name: lastName },
          tos_acceptance: {
            date: new Date(),
            ip: "8.8.8.8",
          },
        });
      }

      console.log(account, "acc");

      const token = await stripe.tokens.create({
        bank_account: {
          country: "US",
          currency: "usd",
          account_holder_name: `${firstName} ${lastName}`,
          account_holder_type: "individual",
          routing_number: routingNumber,
          account_number: accountNumber,
        },
      });

      if (!userData?.bank_account_id) {
        bankAccount = await stripe.accounts.createExternalAccount(
          userData?.stripe_account_id
            ? userData?.stripe_account_id
            : account?.id,
          {
            external_account: token?.id,
            default_for_currency: true,
          }
        );
        newUserData = await userSchema?.findOneAndUpdate(
          { _id: user_id },
          { stripe_account_id: account?.id, bank_account_id: bankAccount?.id },
          { new: true }
        );
      }

      console.log(bankAccount, "bankAccc");

      const transfer = await stripe.transfers.create({
        amount: amount * 100,
        currency: "usd",
        destination: userData?.stripe_account_id
          ? userData?.stripe_account_id
          : account?.id,
      });

      if (transfer) {
        var newWalletData = await walletSchema?.findOne(
          { user_id },
          { amount: parseInt(walletData?.amount) - parseInt(amount) },
          { new: true }
        );
      }

      res?.status(200)?.send({
        status: "success",
        data: { transfer, bankAccount, newUserData, newWalletData },
      });
    } catch (err) {
      res?.status(200)?.send({ status: "failed", message: err?.message });
    }
  },
};
