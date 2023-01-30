import { Text, TouchableOpacity, View } from "react-native";

interface IMarkdownProps {
  source?: any;
  fontFamily?: string;
}

export const Markdown = (props: IMarkdownProps) => {
  const { source, fontFamily } = props;

  var data = source.split("\n");

  return (
    <>
      {data.map((value: string, index: any) => {
        return extract(index, value.trim(), {
          fontFamily: fontFamily,
        });
      })}
    </>
  );
};

const renderTitle = (key: any, text: string, style: any) => {
  return (
    <Text
      style={[
        style,
        {
          fontSize: 18,
          textAlign: "left",
          fontWeight: "bold",
          marginTop: 12,
        },
      ]}
      key={key}
    >
      {text}
    </Text>
  );
};

const renderSubtitle = (key: any, text: string, style: any) => {
  return (
    <Text
      style={[
        style,
        {
          fontSize: 16,
          textAlign: "left",
          fontWeight: "bold",
          marginTop: 12,
        },
      ]}
      key={key}
    >
      {text}
    </Text>
  );
};

const renderText = (key: any, text: string, style: any) => {
  return (
    <Text
      style={[
        style,
        {
          fontSize: 16,
          textAlign: "left",
        },
      ]}
      key={key}
    >
      {text}
    </Text>
  );
};

const renderLink = (key: any, text: string, style: any) => {
  return (
    <TouchableOpacity
      key={key}
      onPress={() => {
        var location = new Location();
        location.assign(text);

        window.location = location;
      }}
    >
      <Text
        style={[
          style,
          {
            color: "#0000FF",
            fontSize: 16,
            textAlign: "left",
          },
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  );
};

const extractFromTo = (
  index: any,
  text: string,
  from: string,
  to: string,
  style: any
) => {
  const firstIndex = text.indexOf(from);

  const fullLink = text.slice(firstIndex);

  const secondIndex = fullLink.indexOf(to);

  const trimmedLink = fullLink.slice(0, secondIndex);

  const before = text.slice(0, firstIndex);
  const after = text.slice(firstIndex + trimmedLink.length);

  var content = [];

  content.push(extract(index + "_" + 0, before, style));
  content.push(renderLink(index + "_" + 1, trimmedLink, style));
  content.push(extract(index + "_" + 2, after, style));

  return (
    <View
      key={index}
      style={{
        display: "flex",
        flexWrap: "wrap",
        flexDirection: "column",
      }}
    >
      {content.map((component) => {
        return component;
      })}
    </View>
  );
};

export const extract = (index: any, value: string, style: any) => {
  var text = value.trimStart();

  if (text == "") {
    return null;
  }

  /** Title */
  if (text.startsWith("# ")) {
    text = text.slice(2);
    return renderTitle(index, text, style);
  }

  /** Subtitle */
  if (text.startsWith("## ")) {
    text = text.slice(3);
    return renderSubtitle(index, text, style);
  }

  /** Https */
  if (text.includes("https://")) {
    return extractFromTo(index, text, "https://", " ", style);
  }

  /** Http */
  if (text.includes("http://")) {
    return extractFromTo(index, text, "http://", " ", style);
  }

  /** Text */
  return renderText(index, text, style);
};

export default Markdown;
