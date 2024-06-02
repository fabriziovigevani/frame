import { Button, Frog } from "frog";
import { devtools } from "frog/dev";
import { serveStatic } from "frog/serve-static";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/vercel";
import { getUserStatus, registerUser } from "./lib/faucet.js";
import { Container, ContainerItem } from "./components/index.js";

// Uncomment to use Edge Runtime.
// export const config = {
//   runtime: 'edge',
// }

export const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
});

app.frame("/", (c) => {
  //first framer rendered
  //our protocol ats

  return c.res({
    action: "/checkClaim",
    image: (
      <Container>
        <ContainerItem data="Join the excitement at ETH-Prague with our exclusive token distribution faucet" />
      </Container>
    ),
    intents: [
      <Button>Next</Button>,
      <Button.Link href="https://github.com/FarcasterFaucet/faucet-land">
        How it works ?
      </Button.Link>,
    ],
  });
});

app.frame("/checkClaim", async (c) => {
  // Fetch if user is registered
  const { fid } = c.frameData || {};
  if (!fid) {
    return c.error({ message: "No fid" }); // TODO: update message error
  }

  const { canClaim, registeredNextPeriod } = await getUserStatus(fid);

  return c.res({
    action: canClaim ? "/claimed" : "/registered",
    image: (
      <Container>
        {canClaim ? (
          <Claim />
        ) : registeredNextPeriod ? (
          <ClaimTime />
        ) : (
          <ContainerItem data="Register for next period and claim MTK tokens" />
        )}
      </Container>
    ),
    intents: [
      (canClaim || !registeredNextPeriod) && (
        <Button.Transaction target="/claimAndOrRegister">
          {canClaim ? "Claim" : "Register"}
        </Button.Transaction>
      ),
    ],
  });
});

app.transaction("claimAndOrRegister", (c) => {
  if (!c.frameData?.fid) {
    return; //throw error
  }

  return registerUser(c);
});

app.frame("/registered", async (c) => {
  const { transactionId } = c;
  return c.res({
    image: (
      <div style={imageStyles}>Registered successfuly! {transactionId}</div>
    ),
    intents: [<Button.Reset>Done!</Button.Reset>],
  });
});

app.frame("/claimed", async (c) => {
  const { transactionId } = c;
  return c.res({
    image: <div style={imageStyles}>Claimed successfuly! {transactionId}</div>,
    intents: [<Button.Reset>Done!</Button.Reset>],
  });
});

// @ts-ignore
const isEdgeFunction = typeof EdgeFunction !== "undefined";
const isProduction = isEdgeFunction || import.meta.env?.MODE !== "development";
devtools(app, isProduction ? { assetsPath: "/.frog" } : { serveStatic });

export const GET = handle(app);
export const POST = handle(app);
