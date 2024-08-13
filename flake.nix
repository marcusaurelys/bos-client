{
  description = "Nix flake for node.js and nix related stuff";

  # Change this to small if packages are not updated in the unstable branch!
  inputs = { nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable"; };

  outputs = { self, nixpkgs }:
    let
      system = "x86_64-linux";
      pkgs = nixpkgs.legacyPackages.${system};
    in {
      devShells.${system}.default = pkgs.mkShell {
        packages = with pkgs; [
          (python3.withPackages (ps: [
            ps.python-dotenv
            ps.requests
            ps.pymongo
            ps.chromadb
            ps.flask
            ps.openai
          ]))
          nodejs
        ];

        shellHook = ''
          nu
        '';

      };
    };

}
