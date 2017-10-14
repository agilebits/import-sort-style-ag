import {IStyleAPI, IStyleItem} from "import-sort-style";

export default function(styleApi: IStyleAPI): IStyleItem[] {
  const {
    alias,
    and,
    hasNoMember,
    isAbsoluteModule,
    isNodeModule,
    isRelativeModule,
    moduleName,
    naturally,
    unicode,
  } = styleApi;

  return [
    // import "foo"
    {match: and(hasNoMember, isAbsoluteModule)},
    {separator: true},

    // import "./foo"
    {match: and(hasNoMember, isRelativeModule)},
    {separator: true},

    // import … from "fs";
    {match: isNodeModule, sort: moduleName(naturally), sortNamedMembers: alias(naturally)},
    {separator: true},

    // import … from "foo";
    {match: isAbsoluteModule, sort: moduleName(naturally), sortNamedMembers: alias(naturally)},
    {separator: true},

    // import … from "./foo";
    // import … from "../foo";
    {match: isRelativeModule, sort: [agDotSegmentCount, moduleName(naturally)], sortNamedMembers: alias(naturally)},
    {separator: true},
  ];
}

function agDotSegmentCount(firstImport, secondImport) {
  const firstDotString = (firstImport.moduleName.match(/^(?:\.\.?\/)+/) || [""])[0];
  const secondDotString = (firstImport.moduleName.match(/^(?:\.\.?\/)+/) || [""])[0];
  const firstCount = (firstDotString.match(/\./g) || []).length;
  const secondCount = (secondDotString.match(/\./g) || []).length;

  if (firstCount > secondCount) {
      return -1;
  }
  if (firstCount < secondCount) {
      return 1;
  }
  return 0;
}
