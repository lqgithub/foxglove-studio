// This Source Code Form is subject to the terms of the Mozilla Public
// License, v2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/

import { StrictMode, useMemo } from "react";
import { createRoot } from "react-dom/client";

import { useCrash } from "@foxglove/hooks";
import { PanelExtensionContext } from "@foxglove/studio";
import { CaptureErrorBoundary } from "@foxglove/studio-base/components/CaptureErrorBoundary";
import Panel from "@foxglove/studio-base/components/Panel";
import { PanelExtensionAdapter } from "@foxglove/studio-base/components/PanelExtensionAdapter";
import { SaveConfig } from "@foxglove/studio-base/types/panels";

import TeleopPanel from "./TeleopPanel";

function initPanel(crash: ReturnType<typeof useCrash>, context: PanelExtensionContext) {
  const root = createRoot(context.panelElement);
  root.render(
    <StrictMode>
      <CaptureErrorBoundary onError={crash}>
        <TeleopPanel context={context} />
      </CaptureErrorBoundary>
    </StrictMode>,
  );
  // ReactDOM.render(
  //   <StrictMode>
  //     <CaptureErrorBoundary onError={crash}>
  //       <TeleopPanel context={context} />
  //     </CaptureErrorBoundary>
  //   </StrictMode>,
  //   context.panelElement,
  // );
  return () => {
    // ReactDOM.unmountComponentAtNode(context.panelElement);
    setTimeout(() => {
      root.unmount();
    }, 0);
  };
}

type Props = {
  config: unknown;
  saveConfig: SaveConfig<unknown>;
};

function TeleopPanelAdapter(props: Props) {
  const crash = useCrash();
  const boundInitPanel = useMemo(() => initPanel.bind(undefined, crash), [crash]);

  return (
    <PanelExtensionAdapter
      config={props.config}
      saveConfig={props.saveConfig}
      initPanel={boundInitPanel}
      highestSupportedConfigVersion={1}
    />
  );
}

TeleopPanelAdapter.panelType = "Teleop";
TeleopPanelAdapter.defaultConfig = {};

export default Panel(TeleopPanelAdapter);
